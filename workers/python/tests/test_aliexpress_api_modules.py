from __future__ import annotations

import hashlib
import hmac
import os
import unittest
from unittest.mock import patch

from workers.python.collectors import aliexpress_api
from workers.python.collectors.aliexpress_api import AliExpressAPI
from workers.python.collectors.aliexpress_product_normalizer import (
    normalize_aliexpress_product,
    number_value,
    rating_value,
    string_value,
)
from workers.python.collectors.aliexpress_response import extract_aliexpress_products, loads_aliexpress_response
from workers.python.collectors.aliexpress_signing import aliexpress_signature


class AliExpressApiModulesTest(unittest.TestCase):
    def test_facade_keeps_private_helper_aliases(self) -> None:
        self.assertIs(aliexpress_api._loads, loads_aliexpress_response)
        self.assertIs(aliexpress_api._extract_products, extract_aliexpress_products)
        self.assertIs(aliexpress_api._normalize_product, normalize_aliexpress_product)
        self.assertIs(aliexpress_api._number, number_value)
        self.assertIs(aliexpress_api._rating, rating_value)
        self.assertIs(aliexpress_api._string, string_value)

    def test_signature_ignores_existing_sign_and_supports_hash_modes(self) -> None:
        params = {"b": "2", "a": "1", "sign": "ignore"}
        sign_body = "a1b2"
        wrapped = b"secreta1b2secret"

        self.assertEqual(aliexpress_signature(params, "secret", "md5"), hashlib.md5(wrapped).hexdigest().upper())
        self.assertEqual(aliexpress_signature(params, "secret", "sha256"), hashlib.sha256(wrapped).hexdigest().upper())
        self.assertEqual(
            aliexpress_signature(params, "secret", "hmac"),
            hmac.new(b"secret", sign_body.encode("utf-8"), hashlib.md5).hexdigest().upper(),
        )
        self.assertEqual(
            aliexpress_signature(params, "secret", "hmac-sha256"),
            hmac.new(b"secret", sign_body.encode("utf-8"), hashlib.sha256).hexdigest().upper(),
        )

    def test_api_sign_delegates_to_signature_module(self) -> None:
        api = AliExpressAPI()
        api.app_secret = "secret"
        api.sign_method = "md5"

        self.assertEqual(api._sign({"b": "2", "a": "1"}), aliexpress_signature({"b": "2", "a": "1"}, "secret", "md5"))

    def test_loads_response_rejects_non_objects_and_api_errors(self) -> None:
        self.assertEqual(loads_aliexpress_response('{"ok": true}')["ok"], True)
        with self.assertRaisesRegex(RuntimeError, "non-object"):
            loads_aliexpress_response("[]")
        with self.assertRaisesRegex(RuntimeError, "AliExpress API error"):
            loads_aliexpress_response('{"error_response": {"code": "bad-request"}}')

    def test_extract_products_accepts_list_or_single_product_rows(self) -> None:
        body = {
            "aliexpress_affiliate_product_query_response": {
                "resp_result": {"result": {"products": {"product": [{"product_id": "p1"}, "not-a-row", {"product_id": "p2"}]}}}
            }
        }
        single = {
            "aliexpress_affiliate_product_query_response": {
                "resp_result": {"result": {"products": {"product": {"product_id": "p3"}}}}
            }
        }

        self.assertEqual([row["product_id"] for row in extract_aliexpress_products(body)], ["p1", "p2"])
        self.assertEqual(extract_aliexpress_products(single)[0]["product_id"], "p3")
        self.assertEqual(extract_aliexpress_products({}), [])

    def test_normalize_product_keeps_price_rating_and_fallbacks_stable(self) -> None:
        item = {
            "product_url": "https://example.test/item",
            "item_id": "item-1",
            "title": " USB charger ",
            "image_url": "https://example.test/image.jpg",
            "sale_price": "1,299.50",
            "shipping_fee": "0",
            "evaluate_rate": "96%",
            "category": "charger",
        }

        with patch("workers.python.collectors.aliexpress_product_normalizer.utc_today", return_value="2026-05-28"):
            product = normalize_aliexpress_product(item)

        self.assertEqual(product["source_url"], "https://example.test/item")
        self.assertEqual(product["product_id"], "item-1")
        self.assertEqual(product["title"], "USB charger")
        self.assertEqual(product["price"], 1299.5)
        self.assertEqual(product["shipping"], 0)
        self.assertEqual(product["rating"], 4.8)
        self.assertEqual(product["currency"], "USD")
        self.assertEqual(product["captured_at"], "2026-05-28")
        self.assertIs(product["raw_json"], item)

    def test_value_helpers_handle_common_api_shapes(self) -> None:
        self.assertEqual(string_value(" charger "), "charger")
        self.assertEqual(string_value(None), "")
        self.assertEqual(number_value("1,234.5%"), 1234.5)
        self.assertIsNone(number_value("not-a-number"))
        self.assertEqual(rating_value("4.7"), 4.7)
        self.assertEqual(rating_value("92%"), 4.6)
        self.assertEqual(rating_value(None), 0)

    def test_missing_credentials_block_live_api_before_network(self) -> None:
        with patch.dict(os.environ, {}, clear=True):
            api = AliExpressAPI()

        self.assertFalse(api.is_configured())
        with self.assertRaisesRegex(RuntimeError, "manual seed CSV"):
            api.search_products("charger")


if __name__ == "__main__":
    unittest.main()
