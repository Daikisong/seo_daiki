from __future__ import annotations

import os
from datetime import datetime, timezone
from urllib import request

from workers.python.common import DATA, slugify, write_json
from workers.python.collectors.aliexpress_config import (
    AliExpressConfig,
    aliexpress_config_from_env,
    aliexpress_configured,
)
from workers.python.collectors.aliexpress_product_normalizer import (
    normalize_aliexpress_product as _normalize_product,
    number_value as _number,
    rating_value as _rating,
    string_value as _string,
)
from workers.python.collectors.aliexpress_request import (
    PRODUCT_QUERY_METHOD,
    encoded_form_body,
    form_request,
    product_query_params,
    signed_request_params,
)
from workers.python.collectors.aliexpress_response import extract_aliexpress_products as _extract_products
from workers.python.collectors.aliexpress_response import loads_aliexpress_response as _loads
from workers.python.collectors.aliexpress_signing import aliexpress_signature


class AliExpressAPI:
    """Small wrapper boundary for official AliExpress/Open Platform calls."""

    def __init__(self) -> None:
        self.config = aliexpress_config_from_env(os.environ)
        self.app_key = self.config.app_key
        self.app_secret = self.config.app_secret
        self.tracking_id = self.config.tracking_id
        self.base_url = self.config.base_url
        self.sign_method = self.config.sign_method

    def is_configured(self) -> bool:
        return aliexpress_configured(self._runtime_config())

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
            PRODUCT_QUERY_METHOD,
            product_query_params(
                keyword=keyword,
                page_no=page_no,
                page_size=page_size,
                ship_to_country=ship_to_country,
                target_currency=target_currency,
                target_language=target_language,
                tracking_id=self.tracking_id or "",
            ),
        )
        return [_normalize_product(item) for item in _extract_products(body)]

    def _call(self, method: str, params: dict[str, str]) -> dict[str, object]:
        common = signed_request_params(
            self._runtime_config(),
            method,
            params,
            datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
        )
        api_request = form_request(self.base_url, encoded_form_body(common))
        with request.urlopen(api_request, timeout=30) as response:
            payload = response.read().decode("utf-8")
        return _loads(payload)

    def _sign(self, params: dict[str, str]) -> str:
        return aliexpress_signature(params, self.app_secret, self.sign_method)

    def _runtime_config(self) -> AliExpressConfig:
        return AliExpressConfig(
            app_key=self.app_key,
            app_secret=self.app_secret,
            tracking_id=self.tracking_id,
            base_url=self.base_url,
            sign_method=self.sign_method,
        )


def search_aliexpress_products(keyword: str, page_size: int = 20) -> str:
    products = AliExpressAPI().search_products(keyword=keyword, page_size=page_size)
    output = DATA / "raw" / f"aliexpress-{slugify(keyword)}.json"
    return str(write_json(output, products))
