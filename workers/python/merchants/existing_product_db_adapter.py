from __future__ import annotations

from typing import Any


class ExistingProductDbAdapter:
    def validate_credentials(self) -> bool:
        return True

    def search_candidates(self, query: str, market: str, language: str) -> list[dict[str, Any]]:
        return []

    def normalize_candidate(self, raw: dict[str, Any]) -> dict[str, Any]:
        return dict(raw, sourceMode="existing_product_db_now")

    def build_affiliate_url(self, candidate: dict[str, Any], tracking: dict[str, Any]) -> str:
        raise NotImplementedError("Existing product DB adapter does not create monetized links automatically.")

    def refresh_offer(self, candidate_id: str) -> dict[str, Any]:
        return {"candidateId": candidate_id, "status": "existing_db_refresh_required"}

    def validate_policy(self, candidate: dict[str, Any]) -> dict[str, Any]:
        return {"candidateId": candidate.get("id"), "status": "human_review_required"}

    def get_required_disclosures(self) -> list[str]:
        return ["Human approval required before monetized links."]
