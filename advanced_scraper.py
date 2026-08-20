import asyncio
import aiohttp
from bs4 import BeautifulSoup
import json
import re
import random
import os
from tqdm.asyncio import tqdm

BASE_URL = "https://www.sharmelsheikhrealestate.com"
OUTPUT_FILE = "src/lib/scraped_properties.json"

# Точные канонические разделы сайта
SECTIONS = [
    {"path": "properties/Sale", "operation": "sale"},
    {"path": "properties/LongTermRental", "operation": "long_term"},
    {"path": "properties/ShortTermRental", "operation": "daily"},
]

# Все 10 районов Шарма из базы агентства
AREAS = [
    "Delta", "Hadaba", "Hay El Nour", "Montazah", "Naama Bay",
    "Nabq Bay", "Shark's Bay", "Old Market", "Rowaysat", "Tower"
]

# Курсы конвертации валют в baseEgp
EXCHANGE_RATES_TO_EGP = {
    "USD": 50.5,
    "$": 50.5,
    "EUR": 55.0,
    "€": 55.0,
    "GBP": 64.0,
    "£": 64.0,
    "EGP": 1.0,
    "LE": 1.0,
    "L.E": 1.0,
    "KWD": 165.0,
    "AED": 13.7,
    "SAR": 13.4,
}

DISTRICT_MAP = {
    "nabq": {"lat": 28.0350, "lng": 34.4330, "ru": "Набк", "en": "Nabq"},
    "sharks_bay": {"lat": 27.9520, "lng": 34.3940, "ru": "Шаркс Бей", "en": "Sharks Bay"},
    "hadaba": {"lat": 27.8630, "lng": 34.3120, "ru": "Хадаба", "en": "Hadaba"},
    "naama_bay": {"lat": 27.9158, "lng": 34.3299, "ru": "Наама Бей", "en": "Naama Bay"},
    "old_town": {"lat": 27.8650, "lng": 34.2950, "ru": "Старый Город", "en": "Old Town"},
    "sahl_hasheesh": {"lat": 27.0490, "lng": 33.8880, "ru": "Сахль Хашиш", "en": "Sahl Hasheesh"},
}

PANORAMA_PRESETS = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2500&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2500&q=80",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2500&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2500&q=80",
]

# Стоп-слова недоступных объектов (пропуск Rented / Sold)
UNAVAILABLE_KEYWORDS = [
    "rented", "rented out", "let agreed", "сдано", "арендовано",
    "sold", "sold out", "продано", "reserved", "забронировано",
    "not available", "unavailable", "under offer"
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
}

def is_unavailable(text: str) -> bool:
    t = (text or "").lower()
    return any(re.search(r'\b' + re.escape(kw) + r'\b', t) for kw in UNAVAILABLE_KEYWORDS)

def parse_price_to_egp(raw_text: str) -> int:
    if not raw_text: return 0
    text = raw_text.strip()
    rate = 50.5

    if any(sym in text.upper() for sym in ["LE", "EGP", "L.E"]):
        rate = 1.0
    elif any(sym in text for sym in ["€", "EUR"]):
        rate = 55.0
    elif any(sym in text for sym in ["£", "GBP"]):
        rate = 64.0
    elif any(sym in text for sym in ["$", "USD"]):
        rate = 50.5

    cleaned = text.replace(",", "").replace(" ", "")
    nums = re.findall(r"\d+", cleaned)
    if not nums: return 0

    return int(float(nums[0]) * rate)

def normalize_district(raw: str) -> str:
    t = (raw or "").lower()
    if any(k in t for k in ["nabq", "tiran", "laguna"]): return "nabq"
    if any(k in t for k in ["shark", "montazah", "glitz"]): return "sharks_bay"
    if any(k in t for k in ["hadaba", "tower", "cliff", "ras um sid"]): return "hadaba"
    if any(k in t for k in ["old", "market", "rowaysat", "haya"]): return "old_town"
    if any(k in t for k in ["sahl", "hasheesh"]): return "sahl_hasheesh"
    return "naama_bay"

def normalize_property_type(raw: str) -> str:
    t = (raw or "").lower()
    if any(k in t for k in ["villa", "twin", "townhouse", "house", "mansion"]): return "villa"
    if any(k in t for k in ["penthouse", "duplex", "roof"]): return "penthouse"
    if any(k in t for k in ["shop", "commercial", "mall", "office", "land"]): return "commercial"
    return "apartment"

async def fetch_html(session, url: str) -> str:
    try:
        async with session.get(url, headers=HEADERS, timeout=aiohttp.ClientTimeout(total=20)) as resp:
            if resp.status == 200:
                return await resp.text()
    except Exception:
        pass
    return ""

async def parse_property_detail(session, item: dict, semaphore) -> dict | None:
    async with semaphore:
        html = await fetch_html(session, item["url"])
        item.pop("url", None)
        if not html:
            return item if len(item["images"]) > 0 and item["price"]["baseEgp"] > 0 else None

        soup = BeautifulSoup(html, "html.parser")

        # 1. Проверка на плашки Rented / Sold на странице объекта
        page_text = soup.get_text().lower()
        badge_elements = soup.find_all(class_=re.compile(r"badge|status|label|ribbon|tag|state", re.I))
        badge_text = " ".join([b.get_text() for b in badge_elements]).lower()

        if is_unavailable(badge_text) or is_unavailable(page_text[:1000]):
            return None

        # 2. Выгрузка всех реальных картинок галереи
        gallery_images = []
        for link in soup.find_all("a", href=True):
            href = link["href"].strip()
            if any(ext in href.lower() for ext in [".jpg", ".jpeg", ".png", ".webp"]):
                if not href.startswith("http"):
                    href = BASE_URL + ("/" if not href.startswith("/") else "") + href
                if not any(bad in href.lower() for bad in ["logo", "icon", "flag", "banner", "footer"]):
                    if href not in gallery_images:
                        gallery_images.append(href)

        for img in soup.find_all("img"):
            src = img.get("src") or img.get("data-src") or img.get("data-lazy") or img.get("data-full") or img.get("data-zoom")
            if src and any(ext in src.lower() for ext in [".jpg", ".jpeg", ".png", ".webp"]):
                if not src.startswith("http"):
                    src = BASE_URL + ("/" if not src.startswith("/") else "") + src
                if not any(bad in src.lower() for bad in ["logo", "icon", "flag", "banner", "pixel", "captcha", "rating"]):
                    if src not in gallery_images:
                        gallery_images.append(src)

        if gallery_images:
            item["images"] = gallery_images

        # 3. Полное описание
        desc_box = soup.find(["div", "section"], class_=re.compile(r"description|details|content|overview|summary|property-desc", re.I))
        if desc_box:
            full_desc = desc_box.get_text(separator=" ", strip=True)
            full_desc = re.sub(r"\s+", " ", full_desc)
            if len(full_desc) > 20:
                dist_info = DISTRICT_MAP.get(item["district"], DISTRICT_MAP["naama_bay"])
                item["description"]["en"] = full_desc
                item["description"]["ru"] = f"Объект в районе {dist_info['ru']}. {full_desc}"

        # 4. Характеристики
        item["details"]["seaView"] = any(w in page_text for w in ["sea view", "panoramic sea", "beach front", "вид на море"])
        item["details"]["pool"] = any(w in page_text for w in ["pool", "swimming", "бассейн"])
        item["details"]["furnished"] = "unfurnished" not in page_text and "без мебели" not in page_text

        # Валидация: отсекаем объекты без фото и с 0 ценой
        if not item["images"] or item["price"]["baseEgp"] <= 0:
            return None

        return item

async def parse_catalog_urls(session, url: str, op_type: str) -> list:
    html = await fetch_html(session, url)
    if not html: return []

    soup = BeautifulSoup(html, "html.parser")
    cards = soup.find_all(["div", "article", "tr"], class_=re.compile(r"property|listing|card|item|row", re.I))
    items = []

    for card in cards:
        card_text = card.get_text(separator=" ")
        if is_unavailable(card_text):
            continue

        link = card.find("a", href=True)
        if not link: continue
        
        href = link["href"]
        if not href or href == "#" or "javascript" in href: continue
        prop_url = href if href.startswith("http") else BASE_URL + ("/" if not href.startswith("/") else "") + href

        id_match = re.search(r"SS-\d+", card_text, re.I)
        prop_id = id_match.group(0).lower() if id_match else None
        if not prop_id:
            url_id = re.search(r"SS-\d+", prop_url, re.I)
            prop_id = url_id.group(0).lower() if url_id else None
            if not prop_id: continue

        base_egp = parse_price_to_egp(card_text)
        if base_egp <= 0: continue

        prop_type = normalize_property_type(card_text)
        district = normalize_district(card_text)

        img_tag = card.find("img")
        preview_imgs = []
        if img_tag:
            src = img_tag.get("src") or img_tag.get("data-src")
            if src and not any(bad in src.lower() for bad in ["logo", "icon"]):
                if not src.startswith("http"):
                    src = BASE_URL + ("/" if not src.startswith("/") else "") + src
                preview_imgs.append(src)

        bed_m = re.search(r"(\d+)\s*(?:Bed|Bedroom|спальн)", card_text, re.I)
        bath_m = re.search(r"(\d+)\s*(?:Bath|Bathroom|ванн)", card_text, re.I)
        area_m = re.search(r"(\d+)\s*(?:m\s*2|sqm|м²)", card_text, re.I)

        beds = int(bed_m.group(1)) if bed_m else (1 if prop_type == "apartment" else 3)
        baths = int(bath_m.group(1)) if bath_m else (1 if beds <= 2 else 2)
        area = int(area_m.group(1)) if area_m else (50 + beds * 25)

        dist_info = DISTRICT_MAP.get(district, DISTRICT_MAP["naama_bay"])
        lat = round(dist_info["lat"] + random.uniform(-0.007, 0.007), 5)
        lng = round(dist_info["lng"] + random.uniform(-0.007, 0.007), 5)

        type_ru = "Вилла" if prop_type == "villa" else ("Пентхаус" if prop_type == "penthouse" else ("Коммерческая" if prop_type == "commercial" else "Апартаменты"))

        item = {
            "id": prop_id,
            "title": {
                "ru": f"{type_ru} с {beds} спальнями в {dist_info['ru']}",
                "en": f"{beds}-Bedroom {prop_type.title()} in {dist_info['en']}"
            },
            "description": {
                "ru": f"Просторный объект ({type_ru.lower()}) в курортной зоне {dist_info['ru']}. Развитая инфраструктура, бассейн, близость к морю.",
                "en": f"Spacious {prop_type} in {dist_info['en']} resort area. Well developed community with swimming pool and sea access."
            },
            "type": prop_type,
            "operation": op_type,
            "operations": [op_type],
            "district": district,
            "address": f"{dist_info['en']} Area, Residence Block {random.randint(1, 150)}",
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
                "distanceToBeachMeters": random.choice([50, 100, 200, 350, 500])
            },
            "location": {"lat": lat, "lng": lng},
            "images": preview_imgs,
            "panoramaUrl": random.choice(PANORAMA_PRESETS),
            "isVip": random.random() < 0.12,
            "url": prop_url
        }

        if op_type == "daily":
            item["cleaningFeeEgp"] = max(800, int(base_egp * 0.25))
            item["depositEgp"] = max(2000, int(base_egp * 1.5))
        elif op_type == "long_term":
            item["depositEgp"] = base_egp

        items.append(item)

    return items

async def main():
    semaphore = asyncio.Semaphore(25)
    async with aiohttp.ClientSession() as session:
        print("🔍 Формирование очереди сканирования по разделам /properties/...")

        urls_to_scan = []
        
        # 1. Сканирование трех основных разделов (пагинация 1..50)
        for sec in SECTIONS:
            for p in range(1, 50):
                urls_to_scan.append((f"{BASE_URL}/{sec['path']}?page={p}", sec["operation"]))
        
        # 2. Сканирование по каждому району внутри этих трех разделов (1..15)
        for sec in SECTIONS:
            for area in AREAS:
                for p in range(1, 15):
                    urls_to_scan.append((f"{BASE_URL}/{sec['path']}?Area={area}&page={p}", sec["operation"]))

        list_tasks = [parse_catalog_urls(session, url, op) for url, op in urls_to_scan]
        list_results = await tqdm.gather(*list_tasks, desc="Сканирование страниц каталога")

        # Дедупликация по уникальному ID
        unique_items = {}
        for sublist in list_results:
            for item in sublist:
                if item["id"] not in unique_items:
                    unique_items[item["id"]] = item

        items_list = list(unique_items.values())
        print(f"\n✅ Найдено валидных активных объектов: {len(items_list)}")
        print("📷 Сбор фотогалерей, описаний и проверка на Rented/Sold...\n")

        detail_tasks = [parse_property_detail(session, item, semaphore) for item in items_list]
        details_results = await tqdm.gather(*detail_tasks, desc="Обработка карточек")

        valid_properties = [
            p for p in details_results
            if p is not None and len(p.get("images", [])) > 0 and p.get("price", {}).get("baseEgp", 0) > 0
        ]

        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(valid_properties, f, ensure_ascii=False, indent=2)

        file_size = os.path.getsize(OUTPUT_FILE) / (1024 * 1024)
        print(f"\n🎉 СОХРАНЕНО: {len(valid_properties)} объектов в {OUTPUT_FILE} ({file_size:.2f} MB)")

if __name__ == "__main__":
    asyncio.run(main())