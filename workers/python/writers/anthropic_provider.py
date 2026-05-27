from __future__ import annotations

from dataclasses import dataclass
import os
from typing import Any

from workers.python.writers.llm_http import join_text_parts, post_json
from workers.python.writers.llm_provider_types import required_env


def extract_anthropic_text(body: dict[str, Any]) -> str:
    parts: list[str] = []
    for content in body.get("content", []):
        text = content.get("text")
        if isinstance(text, str):
            parts.append(text)
    return join_text_parts(parts)


@dataclass
class AnthropicProvider:
    model: str = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-latest")
    base_url: str = os.getenv("ANTHROPIC_BASE_URL", "https://api.anthropic.com/v1")
    max_tokens: int = int(os.getenv("ANTHROPIC_MAX_TOKENS", "1800"))
    api_version: str = os.getenv("ANTHROPIC_VERSION", "2023-06-01")

    def generate(self, prompt: str) -> str:
        body = post_json(
            f"{self.base_url.rstrip('/')}/messages",
            {
                "model": self.model,
                "max_tokens": self.max_tokens,
                "messages": [{"role": "user", "content": prompt}],
            },
            {
                "x-api-key": required_env("ANTHROPIC_API_KEY", "AnthropicProvider"),
                "anthropic-version": self.api_version,
            },
        )
        return extract_anthropic_text(body)
