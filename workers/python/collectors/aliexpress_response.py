from __future__ import annotations

import json


def loads_aliexpress_response(payload: str) -> dict[str, object]:
    data = json.loads(payload)
    if not isinstance(data, dict):
        raise RuntimeError("AliExpress API returned a non-object response.")
    if "error_response" in data:
        raise RuntimeError(f"AliExpress API error: {data['error_response']}")
    return data


def extract_aliexpress_products(body: dict[str, object]) -> list[dict[str, object]]:
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
