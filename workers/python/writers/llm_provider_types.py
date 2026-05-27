from __future__ import annotations

import os
from typing import Protocol


class LLMProvider(Protocol):
    def generate(self, prompt: str) -> str:
        """Return generated text from the configured model provider."""


class LLMConfigurationError(RuntimeError):
    """Raised when a selected provider is missing required environment variables."""


def required_env(name: str, provider: str) -> str:
    value = os.getenv(name)
    if not value:
        raise LLMConfigurationError(f"{provider} requires {name}.")
    return value
