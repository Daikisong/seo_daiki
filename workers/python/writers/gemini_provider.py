from __future__ import annotations

from dataclasses import dataclass
import os
from typing import Any

from workers.python.writers.llm_http import join_text_parts, post_json
from workers.python.writers.llm_provider_types import required_env


def extract_gemini_text(body: dict[str, Any]) -> str:
    parts: list[str] = []
    for candidate in body.get("candidates", []):
        for part in candidate.get("content", {}).get("parts", []):
            text = part.get("text")
            if isinstance(text, str):
                parts.append(text)
    return join_text_parts(parts)


@dataclass
class GeminiProvider:
    model: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    base_url: str = os.getenv("GEMINI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta")
    max_output_tokens: int = int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS", "1800"))

    def generate(self, prompt: str) -> str:
        api_key = required_env("GEMINI_API_KEY", "GeminiProvider")
        body = post_json(
            f"{self.base_url.rstrip('/')}/models/{self.model}:generateContent?key={api_key}",
            {
                "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                "generationConfig": {"maxOutputTokens": self.max_output_tokens},
            },
            {},
        )
        return extract_gemini_text(body)
