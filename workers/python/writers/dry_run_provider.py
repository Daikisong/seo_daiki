from __future__ import annotations

from dataclasses import dataclass


@dataclass
class DryRunProvider:
    def generate(self, prompt: str) -> str:
        return (
            "DRY RUN DRAFT\n\n"
            "The LLM provider is not configured. This draft must be regenerated from an evidence pack before indexing.\n\n"
            f"Prompt preview:\n{prompt[:800]}"
        )
