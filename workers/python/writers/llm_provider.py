from __future__ import annotations

import json
import os
import urllib.request
from dataclasses import dataclass
from typing import Any, Protocol


class LLMProvider(Protocol):
    def generate(self, prompt: str) -> str:
        """Return generated text from the configured model provider."""


class LLMConfigurationError(RuntimeError):
    """Raised when a selected provider is missing required environment variables."""


def _required_env(name: str, provider: str) -> str:
    value = os.getenv(name)
    if not value:
        raise LLMConfigurationError(f"{provider} requires {name}.")
    return value


def _post_json(url: str, payload: dict[str, Any], headers: dict[str, str], timeout: int = 120) -> dict[str, Any]:
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"content-type": "application/json", **headers},
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def _join_text_parts(parts: list[str]) -> str:
    return "\n".join(part.strip() for part in parts if part and part.strip()).strip()


@dataclass
class OpenAIProvider:
    model: str = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")
    base_url: str = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    max_output_tokens: int = int(os.getenv("OPENAI_MAX_OUTPUT_TOKENS", "1800"))

    def generate(self, prompt: str) -> str:
        body = _post_json(
            f"{self.base_url.rstrip('/')}/responses",
            {
                "model": self.model,
                "input": prompt,
                "max_output_tokens": self.max_output_tokens,
            },
            {"authorization": f"Bearer {_required_env('OPENAI_API_KEY', 'OpenAIProvider')}"},
        )

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

        return _join_text_parts(parts)


@dataclass
class GeminiProvider:
    model: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    base_url: str = os.getenv("GEMINI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta")
    max_output_tokens: int = int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS", "1800"))

    def generate(self, prompt: str) -> str:
        api_key = _required_env("GEMINI_API_KEY", "GeminiProvider")
        body = _post_json(
            f"{self.base_url.rstrip('/')}/models/{self.model}:generateContent?key={api_key}",
            {
                "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                "generationConfig": {"maxOutputTokens": self.max_output_tokens},
            },
            {},
        )

        parts: list[str] = []
        for candidate in body.get("candidates", []):
            for part in candidate.get("content", {}).get("parts", []):
                text = part.get("text")
                if isinstance(text, str):
                    parts.append(text)
        return _join_text_parts(parts)


@dataclass
class AnthropicProvider:
    model: str = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-latest")
    base_url: str = os.getenv("ANTHROPIC_BASE_URL", "https://api.anthropic.com/v1")
    max_tokens: int = int(os.getenv("ANTHROPIC_MAX_TOKENS", "1800"))
    api_version: str = os.getenv("ANTHROPIC_VERSION", "2023-06-01")

    def generate(self, prompt: str) -> str:
        body = _post_json(
            f"{self.base_url.rstrip('/')}/messages",
            {
                "model": self.model,
                "max_tokens": self.max_tokens,
                "messages": [{"role": "user", "content": prompt}],
            },
            {
                "x-api-key": _required_env("ANTHROPIC_API_KEY", "AnthropicProvider"),
                "anthropic-version": self.api_version,
            },
        )

        parts: list[str] = []
        for content in body.get("content", []):
            text = content.get("text")
            if isinstance(text, str):
                parts.append(text)
        return _join_text_parts(parts)


@dataclass
class OllamaProvider:
    model: str = os.getenv("OLLAMA_MODEL", "llama3.1")
    base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

    def generate(self, prompt: str) -> str:
        payload = json.dumps({"model": self.model, "prompt": prompt, "stream": False}).encode("utf-8")
        request = urllib.request.Request(
            f"{self.base_url.rstrip('/')}/api/generate",
            data=payload,
            headers={"content-type": "application/json"}
        )
        with urllib.request.urlopen(request, timeout=60) as response:
            body = json.loads(response.read().decode("utf-8"))
        return str(body.get("response", ""))


@dataclass
class DryRunProvider:
    def generate(self, prompt: str) -> str:
        return (
            "DRY RUN DRAFT\n\n"
            "The LLM provider is not configured. This draft must be regenerated from an evidence pack before indexing.\n\n"
            f"Prompt preview:\n{prompt[:800]}"
        )


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
