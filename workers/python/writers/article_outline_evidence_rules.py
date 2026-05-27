from __future__ import annotations

from typing import Any

from workers.python.writers.article_outline_value_utils import list_value


def target_index_status(
    seller_claims: list[dict[str, Any]],
    verified_claims: list[dict[str, Any]],
    variants: list[dict[str, Any]],
    market_risks: list[dict[str, Any]],
) -> str:
    if seller_claims and verified_claims and variants and market_risks:
        return "index_ready"
    return "pending_more_evidence"


def variant_trap_count(variants: list[dict[str, Any]]) -> int:
    return len([variant for variant in variants if list_value(variant.get("risk_flags"))])
