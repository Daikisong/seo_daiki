from __future__ import annotations

from pathlib import Path
from typing import Any

from workers.python.common import read_csv


class ManualCsvMerchantAdapter:
    def __init__(self, path: Path) -> None:
        self.path = path

    def validate_credentials(self) -> bool:
        return self.path.exists()

    def search_candidates(self, query: str, market: str, language: str) -> list[dict[str, Any]]:
        rows = read_csv(self.path)
        query_tokens = set(query.lower().split())
        return [
            self.normalize_candidate(row)
            for row in rows
            if row_matches_candidate_query(row, query_tokens, market, language)
        ]

    def normalize_candidate(self, raw: dict[str, Any]) -> dict[str, Any]:
        return dict(raw, sourceMode=raw.get("source_mode") or "manual_csv_now")

    def build_affiliate_url(self, candidate: dict[str, Any], tracking: dict[str, Any]) -> str:
        raise NotImplementedError("Manual CSV candidates do not create affiliate URLs automatically.")

    def refresh_offer(self, candidate_id: str) -> dict[str, Any]:
        return {"candidateId": candidate_id, "status": "manual_refresh_required"}

    def validate_policy(self, candidate: dict[str, Any]) -> dict[str, Any]:
        return {"candidateId": candidate.get("id"), "status": "human_review_required"}

    def get_required_disclosures(self) -> list[str]:
        return ["Disclose sponsored/affiliate links after human approval.", "Use rel=\"sponsored nofollow\"."]


def row_matches_candidate_query(row: dict[str, Any], query_tokens: set[str], market: str, language: str) -> bool:
    title = str(row.get("title") or "").lower()
    return row.get("market") == market and row.get("language") == language and bool(query_tokens.intersection(title.split()))
