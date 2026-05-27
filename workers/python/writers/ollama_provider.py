from __future__ import annotations

from dataclasses import dataclass
import json
import os
import urllib.request


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
