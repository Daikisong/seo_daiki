from __future__ import annotations

from datetime import datetime, timezone


def normalize_aliexpress_product(item: dict[str, object]) -> dict[str, object]:
    price = number_value(item.get("target_sale_price")) or number_value(item.get("sale_price")) or number_value(item.get("original_price"))
    return {
        "source_url": string_value(item.get("product_detail_url")) or string_value(item.get("product_url")),
        "affiliate_url": string_value(item.get("promotion_link")),
        "product_id": string_value(item.get("product_id")) or string_value(item.get("item_id")),
        "title": string_value(item.get("product_title")) or string_value(item.get("title")),
        "image_url": string_value(item.get("product_main_image_url")) or string_value(item.get("image_url")),
        "price": price,
        "shipping": number_value(item.get("shipping_fee")) or 0,
        "currency": string_value(item.get("target_sale_price_currency")) or string_value(item.get("currency")) or "USD",
        "seller": string_value(item.get("shop_url")) or string_value(item.get("seller_name")),
        "orders": number_value(item.get("lastest_volume")) or number_value(item.get("orders")) or 0,
        "rating": rating_value(item.get("evaluate_rate")),
        "category": string_value(item.get("first_level_category_name")) or string_value(item.get("category")) or "uncategorized",
        "raw_json": item,
        "captured_at": utc_today(),
    }


def string_value(value: object) -> str:
    return value.strip() if isinstance(value, str) else "" if value is None else str(value)


def number_value(value: object) -> float | None:
    if isinstance(value, int | float):
        return float(value)
    if not isinstance(value, str):
        return None
    cleaned = value.replace("%", "").replace(",", "").strip()
    try:
        return float(cleaned)
    except ValueError:
        return None


def rating_value(value: object) -> float:
    number = number_value(value)
    if number is None:
        return 0
    return round(number / 20, 2) if number > 5 else number


def utc_today() -> str:
    return datetime.now(timezone.utc).date().isoformat()
