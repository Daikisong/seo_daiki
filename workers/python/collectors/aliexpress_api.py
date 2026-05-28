from __future__ import annotations

import os
from datetime import datetime, timezone
from urllib import parse, request

from workers.python.common import DATA, slugify, write_json
from workers.python.collectors.aliexpress_product_normalizer import (
    normalize_aliexpress_product as _normalize_product,
    number_value as _number,
    rating_value as _rating,
    string_value as _string,
)
from workers.python.collectors.aliexpress_response import extract_aliexpress_products as _extract_products
from workers.python.collectors.aliexpress_response import loads_aliexpress_response as _loads
from workers.python.collectors.aliexpress_signing import aliexpress_signature


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
        return aliexpress_signature(params, self.app_secret, self.sign_method)


def search_aliexpress_products(keyword: str, page_size: int = 20) -> str:
    products = AliExpressAPI().search_products(keyword=keyword, page_size=page_size)
    output = DATA / "raw" / f"aliexpress-{slugify(keyword)}.json"
    return str(write_json(output, products))
