from __future__ import annotations

from urllib import parse, request

from workers.python.collectors.aliexpress_config import AliExpressConfig
from workers.python.collectors.aliexpress_signing import aliexpress_signature

PRODUCT_QUERY_METHOD = "aliexpress.affiliate.product.query"
FORM_CONTENT_TYPE = "application/x-www-form-urlencoded;charset=utf-8"


def product_query_params(
    keyword: str,
    page_no: int,
    page_size: int,
    ship_to_country: str,
    target_currency: str,
    target_language: str,
    tracking_id: str,
) -> dict[str, str]:
    return {
        "keywords": keyword,
        "page_no": str(page_no),
        "page_size": str(page_size),
        "ship_to_country": ship_to_country,
        "target_currency": target_currency,
        "target_language": target_language,
        "tracking_id": tracking_id,
    }


def common_request_params(
    config: AliExpressConfig,
    method: str,
    params: dict[str, str],
    timestamp: str,
) -> dict[str, str]:
    return {
        "method": method,
        "app_key": config.app_key or "",
        "format": "json",
        "sign_method": config.sign_method,
        "timestamp": timestamp,
        "v": "2.0",
        **params,
    }


def signed_request_params(
    config: AliExpressConfig,
    method: str,
    params: dict[str, str],
    timestamp: str,
) -> dict[str, str]:
    common = common_request_params(config, method, params, timestamp)
    common["sign"] = aliexpress_signature(common, config.app_secret, config.sign_method)
    return common


def encoded_form_body(params: dict[str, str]) -> bytes:
    return parse.urlencode(params).encode("utf-8")


def form_request(base_url: str, body: bytes) -> request.Request:
    return request.Request(
        base_url,
        data=body,
        headers={"content-type": FORM_CONTENT_TYPE},
    )
