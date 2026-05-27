from __future__ import annotations

from dataclasses import dataclass
import os
from typing import Any

from workers.python.writers.llm_http import join_text_parts, post_json
from workers.python.writers.llm_provider_types import required_env


def extract_openai_text(body: dict[str, Any]) -> str:
    if isinstance(body.get("output_text"), str):
        return body["output_text"]

    parts: list[str] = []
    for output in body.get("output", []):
        for content in output.get("content", []):
            text = content.get("text")
            if isinstance(text, str):
                parts.append(text)

    # Compatibility fallback for chat-completions-compatible OpenAI gateways.
    for choice in body.get("choices", []):
        message = choice.get("message", {})
        content = message.get("content")
        if isinstance(content, str):
            parts.append(content)

    return join_text_parts(parts)


@dataclass
class OpenAIProvider:
    model: str = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")
    base_url: str = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    max_output_tokens: int = int(os.getenv("OPENAI_MAX_OUTPUT_TOKENS", "1800"))

    def generate(self, prompt: str) -> str:
        body = post_json(
            f"{self.base_url.rstrip('/')}/responses",
            {
                "model": self.model,
                "input": prompt,
                "max_output_tokens": self.max_output_tokens,
            },
            {"authorization": f"Bearer {required_env('OPENAI_API_KEY', 'OpenAIProvider')}"},
        )
        return extract_openai_text(body)
