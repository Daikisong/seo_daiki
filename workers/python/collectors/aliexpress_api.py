from __future__ import annotations

import hashlib
import hmac
import os
from datetime import datetime, timezone
from urllib import parse, request

from workers.python.common import DATA, slugify, write_json


class AliExpressAPI:
    """Small wrapper boundary for official AliExpress/Open Platform calls."""

    def __init__(self) -> None:
        self.app_key = os.getenv("ALIEXPRESS_APP_KEY")
        self.app_secret = os.getenv("ALIEXPRESS_APP_SECRET")
        self.tracking_id = os.getenv("ALIEXPRESS_TRACKING_ID")
        self.base_url = os.getenv("ALIEXPRESS_API_BASE_URL", "https://api-sg.aliexpress.com/sync")
        self.sign_method = os.getenv("ALIEXPRESS_SIGN_METHOD", "md5").lower()

    def is_configured(self) -> bool:
        return bool(self.app_key and self.app_secret and self.tracking_id)

    def search_products(
        self,
        keyword: str,
        page_no: int = 1,
        page_size: int = 20,
        ship_to_country: str = "US",
        target_currency: str = "USD",
        target_language: str = "EN",
    ) -> list[dict[str, object]]:
        if not self.is_configured():
            raise RuntimeError("AliExpress API credentials are not configured. Use manual seed CSV for local runs.")

        body = self._call(
            "aliexpress.affiliate.product.query",
            {
                "keywords": keyword,
                "page_no": str(page_no),
                "page_size": str(page_size),
                "ship_to_country": ship_to_country,
                "target_currency": target_currency,
                "target_language": target_language,
                "tracking_id": self.tracking_id or "",
            },
        )
        return [_normalize_product(item) for item in _extract_products(body)]

    def _call(self, method: str, params: dict[str, str]) -> dict[str, object]:
        common = {
            "method": method,
            "app_key": self.app_key or "",
            "format": "json",
            "sign_method": self.sign_method,
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
            "v": "2.0",
            **params,
        }
        common["sign"] = self._sign(common)
        encoded = parse.urlencode(common).encode("utf-8")
        api_request = request.Request(
            self.base_url,
            data=encoded,
            headers={"content-type": "application/x-www-form-urlencoded;charset=utf-8"},
        )
        with request.urlopen(api_request, timeout=30) as response:
            payload = response.read().decode("utf-8")
        return _loads(payload)

    def _sign(self, params: dict[str, str]) -> str:
        if not self.app_secret:
            raise RuntimeError("AliExpress API secret is missing.")

        unsigned = {key: value for key, value in params.items() if key != "sign" and value is not None}
        sign_body = "".join(f"{key}{unsigned[key]}" for key in sorted(unsigned))
        wrapped = f"{self.app_secret}{sign_body}{self.app_secret}".encode("utf-8")

        if self.sign_method == "hmac":
            return hmac.new(self.app_secret.encode("utf-8"), sign_body.encode("utf-8"), hashlib.md5).hexdigest().upper()
        if self.sign_method in {"hmac-sha256", "hmac_sha256"}:
            return hmac.new(self.app_secret.encode("utf-8"), sign_body.encode("utf-8"), hashlib.sha256).hexdigest().upper()
        if self.sign_method == "sha256":
            return hashlib.sha256(wrapped).hexdigest().upper()
        return hashlib.md5(wrapped).hexdigest().upper()


def search_aliexpress_products(keyword: str, page_size: int = 20) -> str:
    products = AliExpressAPI().search_products(keyword=keyword, page_size=page_size)
    output = DATA / "raw" / f"aliexpress-{slugify(keyword)}.json"
    return str(write_json(output, products))


def _loads(payload: str) -> dict[str, object]:
    import json

    data = json.loads(payload)
    if not isinstance(data, dict):
        raise RuntimeError("AliExpress API returned a non-object response.")
    if "error_response" in data:
        raise RuntimeError(f"AliExpress API error: {data['error_response']}")
    return data


def _extract_products(body: dict[str, object]) -> list[dict[str, object]]:
    response = body.get("aliexpress_affiliate_product_query_response")
    if not isinstance(response, dict):
        return []
    result_wrapper = response.get("resp_result")
    if not isinstance(result_wrapper, dict):
        return []
    result = result_wrapper.get("result")
    if not isinstance(result, dict):
        return []
    products = result.get("products")
    if not isinstance(products, dict):
        return []
    rows = products.get("product")
    if isinstance(rows, list):
        return [row for row in rows if isinstance(row, dict)]
    if isinstance(rows, dict):
        return [rows]
    return []


def _normalize_product(item: dict[str, object]) -> dict[str, object]:
    price = _number(item.get("target_sale_price")) or _number(item.get("sale_price")) or _number(item.get("original_price"))
    return {
        "source_url": _string(item.get("product_detail_url")) or _string(item.get("product_url")),
        "affiliate_url": _string(item.get("promotion_link")),
        "product_id": _string(item.get("product_id")) or _string(item.get("item_id")),
        "title": _string(item.get("product_title")) or _string(item.get("title")),
        "image_url": _string(item.get("product_main_image_url")) or _string(item.get("image_url")),
        "price": price,
        "shipping": _number(item.get("shipping_fee")) or 0,
        "currency": _string(item.get("target_sale_price_currency")) or _string(item.get("currency")) or "USD",
        "seller": _string(item.get("shop_url")) or _string(item.get("seller_name")),
        "orders": _number(item.get("lastest_volume")) or _number(item.get("orders")) or 0,
        "rating": _rating(item.get("evaluate_rate")),
        "category": _string(item.get("first_level_category_name")) or _string(item.get("category")) or "uncategorized",
        "raw_json": item,
        "captured_at": datetime.now(timezone.utc).date().isoformat(),
    }


def _string(value: object) -> str:
    return value.strip() if isinstance(value, str) else "" if value is None else str(value)


def _number(value: object) -> float | None:
    if isinstance(value, int | float):
        return float(value)
    if not isinstance(value, str):
        return None
    cleaned = value.replace("%", "").replace(",", "").strip()
    try:
        return float(cleaned)
    except ValueError:
        return None


def _rating(value: object) -> float:
    number = _number(value)
    if number is None:
        return 0
    return round(number / 20, 2) if number > 5 else number
