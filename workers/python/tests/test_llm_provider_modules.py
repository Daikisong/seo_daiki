from __future__ import annotations

import os
import unittest
from unittest.mock import patch

from workers.python.writers.anthropic_provider import extract_anthropic_text
from workers.python.writers.dry_run_provider import DryRunProvider
from workers.python.writers.gemini_provider import extract_gemini_text
from workers.python.writers.llm_http import join_text_parts
from workers.python.writers.llm_provider import _join_text_parts, _required_env
from workers.python.writers.llm_provider_registry import get_provider
from workers.python.writers.llm_provider_types import LLMConfigurationError
from workers.python.writers.openai_provider import OpenAIProvider, extract_openai_text


class LLMProviderModulesTest(unittest.TestCase):
    def test_legacy_provider_module_reexports_common_helpers(self) -> None:
        self.assertIs(_join_text_parts, join_text_parts)

        with patch.dict(os.environ, {"TEST_PROVIDER_KEY": "secret"}, clear=False):
            self.assertEqual(_required_env("TEST_PROVIDER_KEY", "TestProvider"), "secret")

    def test_required_env_raises_configuration_error(self) -> None:
        with patch.dict(os.environ, {}, clear=True):
            with self.assertRaisesRegex(LLMConfigurationError, "TestProvider requires MISSING_KEY"):
                _required_env("MISSING_KEY", "TestProvider")

    def test_provider_registry_defaults_to_dry_run_and_rejects_unknown(self) -> None:
        with patch.dict(os.environ, {}, clear=True):
            self.assertIsInstance(get_provider(), DryRunProvider)

        with patch.dict(os.environ, {"LLM_PROVIDER": "none"}, clear=True):
            self.assertIsInstance(get_provider(), DryRunProvider)

        with patch.dict(os.environ, {"LLM_PROVIDER": "unknown"}, clear=True):
            with self.assertRaisesRegex(LLMConfigurationError, "Unsupported LLM_PROVIDER=unknown"):
                get_provider()

    def test_response_extractors_support_each_provider_shape(self) -> None:
        self.assertEqual(extract_openai_text({"output_text": "direct"}), "direct")
        self.assertEqual(
            extract_openai_text({"output": [{"content": [{"text": "one"}, {"text": "two"}]}]}),
            "one\ntwo",
        )
        self.assertEqual(
            extract_openai_text({"choices": [{"message": {"content": "chat fallback"}}]}),
            "chat fallback",
        )
        self.assertEqual(
            extract_gemini_text({"candidates": [{"content": {"parts": [{"text": "gemini"}]}}]}),
            "gemini",
        )
        self.assertEqual(extract_anthropic_text({"content": [{"text": "claude"}]}), "claude")

    def test_openai_generate_uses_extractor_without_network_in_test(self) -> None:
        with patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"}, clear=False):
            with patch("workers.python.writers.openai_provider.post_json", return_value={"output_text": "draft"}) as post_json:
                output = OpenAIProvider(model="test-model", base_url="https://example.test", max_output_tokens=12).generate("prompt")

        self.assertEqual(output, "draft")
        self.assertEqual(post_json.call_args.args[0], "https://example.test/responses")
        self.assertEqual(post_json.call_args.args[1]["model"], "test-model")


if __name__ == "__main__":
    unittest.main()
