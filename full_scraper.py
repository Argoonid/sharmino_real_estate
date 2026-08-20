import asyncio
import aiohttp
from bs4 import BeautifulSoup
import json
import re
import random
import os
from tqdm.asyncio import tqdm

BASE_URL = "https://www.sharmelsheikhrealestate.com"
OUTPUT_FILE = "scraped_properties.json"

# Конвертация валют в египетские фунты (baseEgp)
EXCHANGE_RATES = {
    "EGP": 1.0,
    "LE": 1.0,
    "USD": 49.0,
    "$": 49.0,
    "EUR": 53.0,
    "€": 53.0,
    "GBP": 62.0,
    "£": 62.0,
    "KWD": 160.0,
    "AED": 13.3,
    "SAR": 13.0,
}

# Координаты кластеров в Шарме для точной посадки на карту
DISTRICT_COORDS = {
    "nabq": {"lat": 28.0350, "lng": 34.4330},
    "sharks_bay": {"lat": 27.9520, "lng": 34.3940},
    "hadaba": {"lat": 27.8630, "lng": 34.3120},
    "naama_bay": {"lat": 27.9158, "lng": 34.3299},
    "old_town": {"lat": 27.8650, "lng": 34.2950},
    "sahl_hasheesh": {"lat": 27.0490, "lng": 33.8880},
}

PANORAMA_PRESETS = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2500&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2500&q=80",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2500&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2500&q=80",
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,ru;q=0.8",
}

def map_district(text):
    text = (text or "").lower()
    if "nabq" in text or "tiran" in text: return "nabq"
    if "shark" in text or "montazah" in text: return "sharks_bay"
    if "hadaba" in text or "tower" in text or "cliff" in text: return "hadaba"
    if "old" in text or "market" in text or "rowaysat" in text: return "old_town"
    if "sahl" in text or "hasheesh" in text: return "sahl_hasheesh"
    return "naama_bay"

def map_property_type(text):
    text = (text or "").lower()
    if "villa" in text or "twin" in text or "townhouse" in text: return "villa"
    if "penthouse" in text or "duplex" in text: return "penthouse"
    if "shop" in text or "commercial" in text or "mall" in text or "land" in text: return "commercial"
    return "apartment"

def parse_price(raw_text):
    if not raw_text:
        return 3500000
    cleaned = raw_text.replace(",", "").replace(" ", "")
    rate = 1.0
    for sym, r in EXCHANGE_RATES.items():
        if sym.lower() in raw_text.lower():
            rate = r
            break
    nums = re.findall(r"\d+", cleaned)
    if not nums:
        return 3500000
    return int(float(nums[0]) * rate)

async def fetch_html(session, url, retries=3):
    for _ in range(retries):
        try:
            async with session.get(url, headers=HEADERS, timeout=aiohttp.ClientTimeout(total=20)) as resp:
                if resp.status == 200:
                    return await resp.text()
                elif resp.status == 404:
                    return None
        except Exception:
            await asyncio.sleep(1)
    return None

async def parse_property_detail(session, item, semaphore):
    async with semaphore:
        html = await fetch_html(session, item["url"])
        if not html:
            item.pop("url", None)
            return item

        soup = BeautifulSoup(html, "html.parser")

        # 1. Поиск всех реальных фото объекта в галерее
        images = []
        for img in soup.find_all("img"):
            src = img.get("src") or img.get("data-src") or img.get("data-lazy")
            if src and any(ext in src.lower() for ext in [".jpg", ".jpeg", ".png", ".webp"]):
                if not src.startswith("http"):
                    src = BASE_URL + ("/" if not src.startswith("/") else "") + src
                # Отсекаем служебные иконки, флаги и баннеры
                if not any(bad in src.lower() for bad in ["logo", "icon", "flag", "banner", "pixel", "captcha", "rating"]):
                    if src not in images:
                        images.append(src)

        if images:
            item["images"] = images

        # 2. Полноценное описание объекта
        desc_box = soup.find(["div", "section"], class_=re.compile(r"description|details|content|overview|summary", re.I))
        raw_desc = desc_box.get_text(separator=" ", strip=True) if desc_box else ""

        if raw_desc and len(raw_desc) > 30:
            cleaned_desc = re.sub(r"\s+", " ", raw_desc)
            item["description"]["en"] = cleaned_desc[:400] + "..."
            item["description"]["ru"] = f"Объект в локации {item['district'].replace('_', ' ').title()}. {cleaned_desc[:300]}..."

        # 3. Характеристики: бассейн, вид на море, мебель
        page_text = soup.get_text().lower()
        item["details"]["seaView"] = any(w in page_text for w in ["sea view", "panoramic sea", "beach front", "вид на море"])
        item["details"]["pool"] = any(w in page_text for w in ["pool", "swimming", "бассейн"])
        item["details"]["furnished"] = "unfurnished" not in page_text and "без мебели" not in page_text

        # 4. Этаж и расстояние до моря
        floor_match = re.search(r"(\d+)(?:st|nd|rd|th)?\s*floor", page_text)
        if floor_match:
            item["details"]["floor"] = int(floor_match.group(1))

        item.pop("url", None)
        return item

async def parse_catalog_section(session, section_path, op_type, semaphore):
    items = []
    consecutive_empty = 0

    for page in range(1, 150): # Ограничение до 150 страниц на раздел
        url = f"{BASE_URL}/{section_path}?page={page}"
        html = await fetch_html(session, url)
        
        if not html:
            consecutive_empty += 1
            if consecutive_empty >= 2:
                break
            continue

        soup = BeautifulSoup(html, "html.parser")
        cards = soup.find_all(["div", "article"], class_=re.compile(r"property|listing|card|item", re.I))

        # Фильтруем контейнеры, оставляя только карточки с ссылками на объекты
        valid_cards = [c for c in cards if c.find("a", href=True) and ("SS-" in c.get_text() or "details" in str(c.get("class", "")))]

        if not valid_cards:
            consecutive_empty += 1
            if consecutive_empty >= 2:
                break
            continue
        
        consecutive_empty = 0

        for card in valid_cards:
            link = card.find("a", href=True)
            href = link["href"]
            prop_url = href if href.startswith("http") else BASE_URL + ("/" if not href.startswith("/") else "") + href
            text = card.get_text(separator=" ")

            id_match = re.search(r"SS-\d+", text, re.I)
            prop_id = id_match.group(0).lower() if id_match else f"ss-{abs(hash(prop_url)) % 100000}"

            prop_type = map_property_type(text)
            district = map_district(text)
            base_egp = parse_price(text)

            # Спальни, санузлы, площадь
            bed_m = re.search(r"(\d+)\s*(?:Bed|Bedroom|спальн)", text, re.I)
            bath_m = re.search(r"(\d+)\s*(?:Bath|Bathroom|ванн)", text, re.I)
            area_m = re.search(r"(\d+)\s*(?:m\s*2|sqm|м²)", text, re.I)

            beds = int(bed_m.group(1)) if bed_m else (1 if prop_type == "apartment" else 3)
            baths = int(bath_m.group(1)) if bath_m else (1 if beds <= 2 else 2)
            area = int(area_m.group(1)) if area_m else (55 + beds * 30)

            # Координаты со случайным смещением для карты
            base_coord = DISTRICT_COORDS.get(district, DISTRICT_COORDS["naama_bay"])
            lat = round(base_coord["lat"] + random.uniform(-0.006, 0.006), 5)
            lng = round(base_coord["lng"] + random.uniform(-0.006, 0.006), 5)

            dist_name_en = district.replace("_", " ").title()
            dist_name_ru = "Набк" if district == "nabq" else ("Хадаба" if district == "hadaba" else ("Шаркс Бей" if district == "sharks_bay" else "Наама Бей"))
            type_title_ru = "Вилла" if prop_type == "villa" else ("Пентхаус" if prop_type == "penthouse" else "Апартаменты")

            item = {
                "id": prop_id,
                "title": {
                    "ru": f"{type_title_ru} с {beds} спальнями в {dist_name_ru}",
                    "en": f"{beds}-Bedroom {prop_type.title()} in {dist_name_en}"
                },
                "description": {
                    "ru": f"Просторный объект категории {type_title_ru.lower()} в курортной зоне {dist_name_ru}.",
                    "en": f"Spacious {prop_type} located in prime {dist_name_en} district."
                },
                "type": prop_type,
                "operation": op_type,
                "district": district,
                "address": f"{dist_name_en} Coast, Residence {random.randint(1, 120)}",
                "price": {
                    "baseEgp": base_egp
                },
                "details": {
                    "bedrooms": beds,
                    "bathrooms": baths,
                    "areaSqM": area,
                    "floor": random.randint(1, 4) if prop_type == "apartment" else 1,
                    "seaView": False,
                    "pool": True,
                    "furnished": True,
                    "distanceToBeachMeters": random.choice([50, 100, 150, 300, 500])
                },
                "location": {
                    "lat": lat,
                    "lng": lng
                },
                "images": [
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                ],
                "panoramaUrl": random.choice(PANORAMA_PRESETS),
                "isVip": random.random() < 0.12,
                "url": prop_url
            }

            if op_type == "daily":
                item["cleaningFeeEgp"] = 1500
                item["depositEgp"] = 4000
            elif op_type == "long_term":
                item["depositEgp"] = base_egp

            items.append(item)

    return items

async def main():
    semaphore = asyncio.Semaphore(25) # 25 одновременных потоков

    async with aiohttp.ClientSession() as session:
        print("\n==========================================")
        print("🚀 СБОР ССЫЛОК И ОБЪЕКТОВ ИЗ КАТАЛОГА...")
        print("==========================================")

        tasks_sections = [
            parse_catalog_section(session, "for-sale", "sale", semaphore),
            parse_catalog_section(session, "monthly-rental", "long_term", semaphore),
            parse_catalog_section(session, "daily-rental", "daily", semaphore),
            parse_catalog_section(session, "properties", "sale", semaphore),
        ]
        
        section_results = await asyncio.gather(*tasks_sections)
        all_items = [item for sublist in section_results for item in sublist]

        # Дедупликация по уникальному ID объекта
        unique_map = {}
        for item in all_items:
            if item["id"] not in unique_map:
                unique_map[item["id"]] = item
        
        items_to_process = list(unique_map.values())
        print(f"\n✅ Найдено уникальных объектов: {len(items_to_process)}")
        print("📷 Начинаем сбор фотогалерей и описаний карточек...\n")

        # Асинхронный обход всех карточек с прогресс-баром
        detail_tasks = [parse_property_detail(session, item, semaphore) for item in items_to_process]
        final_properties = await tqdm.gather(*detail_tasks, desc="Парсинг карточек")

        # Сохранение в JSON
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(final_properties, f, ensure_ascii=False, indent=2)

        file_size_mb = os.path.getsize(OUTPUT_FILE) / (1024 * 1024)
        print("\n==========================================")
        print(f"🎉 ГОТОВО! Сохранено {len(final_properties)} объектов.")
        print(f"📁 Файл: {OUTPUT_FILE} ({file_size_mb:.2f} MB)")
        print("==========================================\n")

if __name__ == "__main__":
    asyncio.run(main())