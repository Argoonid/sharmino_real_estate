import asyncio
import aiohttp
from bs4 import BeautifulSoup
import json
import re
import random
import os

BASE_URL = "https://www.sharmelsheikhrealestate.com"
OUTPUT_FILE = "scraped_properties.json"

# Актуальные курсы для перевода в baseEgp
EXCHANGE_RATES_TO_EGP = {
    "EGP": 1.0,
    "LE": 1.0,
    "USD": 49.0,
    "$": 49.0,
    "EUR": 53.0,
    "€": 53.0,
    "GBP": 62.0,
    "£": 62.0
}

# Координаты районов для карты (с последующим джиттером)
DISTRICT_COORDS = {
    "naama_bay": {"lat": 27.9158, "lng": 34.3299},
    "old_town": {"lat": 27.8650, "lng": 34.2950},
    "hadaba": {"lat": 27.8630, "lng": 34.3120},
    "sharks_bay": {"lat": 27.9520, "lng": 34.3940},
    "sahl_hasheesh": {"lat": 27.0490, "lng": 33.8880},
    "nabq": {"lat": 28.0350, "lng": 34.4330}
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9,ru;q=0.8",
}

def map_district(raw_text):
    text = (raw_text or "").lower()
    if "nabq" in text: return "nabq"
    if "shark" in text: return "sharks_bay"
    if "hadaba" in text: return "hadaba"
    if "old" in text or "market" in text: return "old_town"
    if "sahl" in text or "hasheesh" in text: return "sahl_hasheesh"
    if "naama" in text: return "naama_bay"
    if "montazah" in text or "tower" in text or "delta" in text: return "nabq"
    return "naama_bay"

def map_property_type(raw_text):
    text = (raw_text or "").lower()
    if "villa" in text or "twin" in text or "townhouse" in text: return "villa"
    if "penthouse" in text: return "penthouse"
    if "commercial" in text or "shop" in text or "mall" in text or "land" in text: return "commercial"
    return "apartment"

def parse_price_to_egp(text):
    if not text:
        return 3500000
    cleaned = text.replace(',', '').replace(' ', '')
    
    rate = 1.0
    for curr_symbol, r in EXCHANGE_RATES_TO_EGP.items():
        if curr_symbol.lower() in text.lower():
            rate = r
            break
            
    nums = re.findall(r'\d+', cleaned)
    if not nums:
        return 3500000
        
    amount = float(nums[0])
    return int(amount * rate)

async def fetch_page(session, url):
    try:
        async with session.get(url, headers=HEADERS, timeout=15) as resp:
            if resp.status == 200:
                return await resp.text()
    except Exception as e:
        print(f"[ERR] Ошибка запроса к {url}: {e}")
    return None

async def parse_property_detail(session, prop_url, base_item, semaphore):
    async with semaphore:
        html = await fetch_page(session, prop_url)
        if not html:
            return base_item

        soup = BeautifulSoup(html, 'html.parser')
        
        # 1. Сбор картинок
        images = []
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src') or img.get('data-lazy')
            if src and any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                if not src.startswith('http'):
                    src = BASE_URL + ('/' if not src.startswith('/') else '') + src
                if not any(bad in src.lower() for bad in ['logo', 'icon', 'flag', 'banner', 'pixel']):
                    if src not in images:
                        images.append(src)

        if not images:
            images = base_item["images"]

        # 2. Описание
        desc_div = soup.find('div', class_=re.compile(r'description|details|content|overview', re.I))
        raw_desc = desc_div.get_text(separator=' ', strip=True) if desc_div else ""
        
        if raw_desc and len(raw_desc) > 30:
            desc_en = raw_desc[:350] + "..."
            desc_ru = f"Объект в престижном районе {base_item['district'].replace('_', ' ').title()}. {raw_desc[:250]}..."
        else:
            desc_ru = f"Отличный объект ({base_item['type']}) в курортной зоне Шарм-эль-Шейха. Закрытая территория, бассейн и близость к морю."
            desc_en = f"Great {base_item['type']} in Sharm El Sheikh resort area. Gated community with swimming pool and sea access."

        # 3. Удобства и вид
        page_text = soup.get_text().lower()
        sea_view = "sea view" in page_text or "panoramic sea" in page_text
        pool = "pool" in page_text or "swimming" in page_text
        furnished = "unfurnished" not in page_text

        # Обновляем объект
        base_item["images"] = images
        base_item["description"] = {"ru": desc_ru, "en": desc_en}
        base_item["details"]["seaView"] = sea_view
        base_item["details"]["pool"] = pool
        base_item["details"]["furnished"] = furnished
        
        # Рандомная панорама из красивых пресетов для демонстрации фичи
        panoramas = [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2500&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2500&q=80',
            'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2500&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2500&q=80'
        ]
        base_item["panoramaUrl"] = random.choice(panoramas)

        return base_item

async def parse_catalog_section(session, section_type, semaphore):
    items = []
    # Обходим страницы каталога (sale, monthly-rental, daily-rental)
    for page in range(1, 40):
        url = f"{BASE_URL}/{section_type}?page={page}"
        print(f"[*] Сбор списка: {section_type} -> страница {page}...")
        html = await fetch_page(session, url)
        if not html:
            break

        soup = BeautifulSoup(html, 'html.parser')
        cards = soup.find_all(['div', 'article'], class_=re.compile(r'property|listing|card|item', re.I))
        
        if not cards or len(cards) < 2:
            break

        for card in cards:
            link = card.find('a', href=True)
            if not link: continue
            
            href = link['href']
            prop_url = href if href.startswith('http') else BASE_URL + ('/' if not href.startswith('/') else '') + href
            text = card.get_text(separator=' ')
            
            id_match = re.search(r'SS-\d+', text)
            prop_id = id_match.group(0) if id_match else f"ss-{random.randint(1000, 9999)}"

            prop_type = map_property_type(text)
            district = map_district(text)
            base_egp = parse_price_to_egp(text)

            # Определяем тип сделки
            operation = "sale"
            if "daily" in section_type or "daily" in text.lower():
                operation = "daily"
            elif "rent" in section_type or "month" in text.lower():
                operation = "long_term"

            # Спальни, санузлы, площадь
            beds = clean_num(re.search(r'(\d+)\s*(?:Bed|Bedroom|спальн)', text, re.I), default=2)
            baths = clean_num(re.search(r'(\d+)\s*(?:Bath|Bathroom|ванн)', text, re.I), default=1)
            area = clean_num(re.search(r'(\d+)\s*(?:m\s*2|sqm|м²)', text, re.I), default=85)

            # Базовые координаты с джиттером (±0.008 градусов ~ 800м)
            base_coord = DISTRICT_COORDS.get(district, DISTRICT_COORDS["naama_bay"])
            lat = round(base_coord["lat"] + random.uniform(-0.008, 0.008), 5)
            lng = round(base_coord["lng"] + random.uniform(-0.008, 0.008), 5)

            type_ru = "Вилла" if prop_type == 'villa' else ("Пентхаус" if prop_type == 'penthouse' else "Апартаменты")
            type_en = prop_type.title()
            dist_title = district.replace('_', ' ').title()

            item = {
                "id": prop_id.lower(),
                "title": {
                    "ru": f"{type_ru} с {beds} спальнями в {dist_title}",
                    "en": f"{beds}-Bedroom {type_en} in {dist_title}"
                },
                "description": {
                    "ru": f"Комфортабельный объект в районе {dist_title}.",
                    "en": f"Comfortable {type_en} in {dist_title} area."
                },
                "type": prop_type,
                "operation": operation,
                "district": district,
                "address": f"{dist_title} Coast, Unit {random.randint(10, 250)}",
                "price": {
                    "baseEgp": base_egp
                },
                "details": {
                    "bedrooms": beds,
                    "bathrooms": baths,
                    "areaSqM": area,
                    "floor": random.randint(1, 4) if prop_type == 'apartment' else 1,
                    "seaView": False,
                    "pool": True,
                    "furnished": True,
                    "distanceToBeachMeters": random.choice([50, 100, 200, 350, 500])
                },
                "location": {
                    "lat": lat,
                    "lng": lng
                },
                "images": [
                    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                ],
                "isVip": random.random() < 0.15, # 15% VIP
                "url": prop_url
            }
            items.append(item)

    return items

def clean_num(match, default=1):
    if not match: return default
    try:
        return int(match.group(1))
    except:
        return default

async def main():
    semaphore = asyncio.Semaphore(20) # 20 одновременных соединений
    async with aiohttp.ClientSession() as session:
        print("=== НАЧАЛО СБОРА КАТАЛОГА ===")
        all_items = []
        for section in ["for-sale", "monthly-rental", "daily-rental"]:
            items = await parse_catalog_section(session, section, semaphore)
            all_items.extend(items)

        # Убираем дубликаты
        unique_map = {item["id"]: item for item in all_items}
        items_to_parse = list(unique_map.values())
        print(f"\n[+] Собрано {len(items_to_parse)} уникальных объектов. Парсим галереи и детальные описания...")

        tasks = [parse_property_detail(session, item["url"], item, semaphore) for item in items_to_parse]
        final_results = await asyncio.gather(*tasks)

        # Удаляем временное поле url перед сохранением
        for obj in final_results:
            obj.pop("url", None)

        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(final_results, f, ensure_ascii=False, indent=2)

        print(f"\n🎉 УСПЕХ! {len(final_results)} объектов сохранено в {OUTPUT_FILE}")

if __name__ == "__main__":
    asyncio.run(main())