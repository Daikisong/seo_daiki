from __future__ import annotations

import unittest
from urllib import parse

from workers.python.collectors import aliexpress_api
from workers.python.collectors.aliexpress_api import AliExpressAPI
from workers.python.collectors.aliexpress_config import (
    DEFAULT_ALIEXPRESS_BASE_URL,
    DEFAULT_ALIEXPRESS_SIGN_METHOD,
    AliExpressConfig,
    aliexpress_config_from_env,
    aliexpress_configured,
)
from workers.python.collectors.aliexpress_request import (
    FORM_CONTENT_TYPE,
    PRODUCT_QUERY_METHOD,
    common_request_params,
    encoded_form_body,
    form_request,
    product_query_params,
    signed_request_params,
)
from workers.python.collectors.aliexpress_signing import aliexpress_signature


class AliExpressRequestModuleTests(unittest.TestCase):
    def test_api_facade_keeps_config_and_request_helpers_available(self) -> None:
        self.assertIs(aliexpress_api.AliExpressConfig, AliExpressConfig)
        self.assertIs(aliexpress_api.aliexpress_config_from_env, aliexpress_config_from_env)
        self.assertIs(aliexpress_api.aliexpress_configured, aliexpress_configured)
        self.assertIs(aliexpress_api.product_query_params, product_query_params)
        self.assertIs(aliexpress_api.signed_request_params, signed_request_params)
        self.assertIs(aliexpress_api.encoded_form_body, encoded_form_body)
        self.assertIs(aliexpress_api.form_request, form_request)

    def test_config_from_env_keeps_defaults_and_lowercases_sign_method(self) -> None:
        default_config = aliexpress_config_from_env({})
        custom_config = aliexpress_config_from_env(
            {
                "ALIEXPRESS_APP_KEY": "app-key",
                "ALIEXPRESS_APP_SECRET": "secret",
                "ALIEXPRESS_TRACKING_ID": "tracking",
                "ALIEXPRESS_API_BASE_URL": "https://api.test/sync",
                "ALIEXPRESS_SIGN_METHOD": "HMAC-SHA256",
            }
        )

        self.assertEqual(default_config.base_url, DEFAULT_ALIEXPRESS_BASE_URL)
        self.assertEqual(default_config.sign_method, DEFAULT_ALIEXPRESS_SIGN_METHOD)
        self.assertFalse(aliexpress_configured(default_config))
        self.assertTrue(aliexpress_configured(custom_config))
        self.assertEqual(custom_config.sign_method, "hmac-sha256")

    def test_product_query_and_signed_common_params_are_stable(self) -> None:
        config = AliExpressConfig("app-key", "secret", "tracking", "https://api.test/sync", "md5")
        query = product_query_params("usb charger", 2, 10, "KR", "KRW", "KO", "tracking")
        signed = signed_request_params(config, PRODUCT_QUERY_METHOD, query, "2026-05-28 00:00:00")

        self.assertEqual(query["page_no"], "2")
        self.assertEqual(query["page_size"], "10")
        self.assertEqual(query["tracking_id"], "tracking")
        self.assertEqual(common_request_params(config, PRODUCT_QUERY_METHOD, query, "2026-05-28 00:00:00")["v"], "2.0")
        self.assertEqual(signed["method"], PRODUCT_QUERY_METHOD)
        self.assertEqual(signed["sign"], aliexpress_signature({key: value for key, value in signed.items() if key != "sign"}, "secret", "md5"))

    def test_encoded_body_and_form_request_do_not_touch_network(self) -> None:
        body = encoded_form_body({"keywords": "usb charger", "page_no": "1"})
        request = form_request("https://api.test/sync", body)
        parsed = parse.parse_qs(body.decode("utf-8"))

        self.assertEqual(parsed["keywords"], ["usb charger"])
        self.assertEqual(request.full_url, "https://api.test/sync")
        self.assertEqual(request.data, body)
        self.assertEqual(request.get_header("Content-type"), FORM_CONTENT_TYPE)

    def test_api_runtime_config_reflects_manual_attribute_overrides(self) -> None:
        api = AliExpressAPI()
        api.app_key = "app-key"
        api.app_secret = "secret"
        api.tracking_id = "tracking"
        api.base_url = "https://api.test/sync"
        api.sign_method = "sha256"

        runtime_config = api._runtime_config()

        self.assertTrue(api.is_configured())
        self.assertEqual(runtime_config.app_key, "app-key")
        self.assertEqual(runtime_config.app_secret, "secret")
        self.assertEqual(runtime_config.tracking_id, "tracking")
        self.assertEqual(runtime_config.base_url, "https://api.test/sync")
        self.assertEqual(runtime_config.sign_method, "sha256")


if __name__ == "__main__":
    unittest.main()
