from __future__ import annotations

from pathlib import Path
from typing import Any, Protocol

from workers.python.common import read_csv


class MerchantAdapter(Protocol):
    def validate_credentials(self) -> bool: ...

    def search_candidates(self, query: str, market: str, language: str) -> list[dict[str, Any]]: ...

    def normalize_candidate(self, raw: dict[str, Any]) -> dict[str, Any]: ...

    def build_affiliate_url(self, candidate: dict[str, Any], tracking: dict[str, Any]) -> str: ...

    def refresh_offer(self, candidate_id: str) -> dict[str, Any]: ...

    def validate_policy(self, candidate: dict[str, Any]) -> dict[str, Any]: ...

    def get_required_disclosures(self) -> list[str]: ...


class ManualCsvMerchantAdapter:
    def __init__(self, path: Path) -> None:
        self.path = path

    def validate_credentials(self) -> bool:
        return self.path.exists()

    def search_candidates(self, query: str, market: str, language: str) -> list[dict[str, Any]]:
        rows = read_csv(self.path)
        query_tokens = set(query.lower().split())
        matches = []
        for row in rows:
            title = str(row.get("title") or "").lower()
            if row.get("market") == market and row.get("language") == language and query_tokens.intersection(title.split()):
                matches.append(self.normalize_candidate(row))
        return matches

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


class DisabledLiveMerchantAdapter:
    name = "disabled_live_adapter"

    def validate_credentials(self) -> bool:
        raise NotImplementedError(f"{self.name} is documentation-only in this phase.")

    def search_candidates(self, query: str, market: str, language: str) -> list[dict[str, Any]]:
        raise NotImplementedError(f"{self.name} is documentation-only in this phase.")

    def normalize_candidate(self, raw: dict[str, Any]) -> dict[str, Any]:
        raise NotImplementedError(f"{self.name} is documentation-only in this phase.")

    def build_affiliate_url(self, candidate: dict[str, Any], tracking: dict[str, Any]) -> str:
        raise NotImplementedError(f"{self.name} is documentation-only in this phase.")

    def refresh_offer(self, candidate_id: str) -> dict[str, Any]:
        raise NotImplementedError(f"{self.name} is documentation-only in this phase.")

    def validate_policy(self, candidate: dict[str, Any]) -> dict[str, Any]:
        raise NotImplementedError(f"{self.name} is documentation-only in this phase.")

    def get_required_disclosures(self) -> list[str]:
        raise NotImplementedError(f"{self.name} is documentation-only in this phase.")


class AliExpressLiveAdapter(DisabledLiveMerchantAdapter):
    name = "AliExpressLiveAdapter"


class TemuLiveAdapter(DisabledLiveMerchantAdapter):
    name = "TemuLiveAdapter"


class AmazonLiveAdapter(DisabledLiveMerchantAdapter):
    name = "AmazonLiveAdapter"


class IHerbLiveAdapter(DisabledLiveMerchantAdapter):
    name = "IHerbLiveAdapter"
