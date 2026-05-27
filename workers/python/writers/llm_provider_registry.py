from __future__ import annotations

import os

from workers.python.writers.anthropic_provider import AnthropicProvider
from workers.python.writers.dry_run_provider import DryRunProvider
from workers.python.writers.gemini_provider import GeminiProvider
from workers.python.writers.llm_provider_types import LLMConfigurationError, LLMProvider
from workers.python.writers.ollama_provider import OllamaProvider
from workers.python.writers.openai_provider import OpenAIProvider


def get_provider() -> LLMProvider:
    provider = os.getenv("LLM_PROVIDER", "dry-run").lower()
    if provider == "openai":
        return OpenAIProvider()
    if provider in {"gemini", "google"}:
        return GeminiProvider()
    if provider in {"anthropic", "claude"}:
        return AnthropicProvider()
    if provider == "ollama":
        return OllamaProvider()
    if provider in {"dry-run", "dryrun", "none"}:
        return DryRunProvider()
    raise LLMConfigurationError(
        f"Unsupported LLM_PROVIDER={provider}. Use dry-run, openai, gemini, anthropic, or ollama."
    )
