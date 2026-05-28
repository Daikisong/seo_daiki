from __future__ import annotations

from typing import Any


class DisabledLiveMerchantAdapter:
    name = "disabled_live_adapter"

    def validate_credentials(self) -> bool:
        raise NotImplementedError(documentation_only_message(self.name))

    def search_candidates(self, query: str, market: str, language: str) -> list[dict[str, Any]]:
        raise NotImplementedError(documentation_only_message(self.name))

    def normalize_candidate(self, raw: dict[str, Any]) -> dict[str, Any]:
        raise NotImplementedError(documentation_only_message(self.name))

    def build_affiliate_url(self, candidate: dict[str, Any], tracking: dict[str, Any]) -> str:
        raise NotImplementedError(documentation_only_message(self.name))

    def refresh_offer(self, candidate_id: str) -> dict[str, Any]:
        raise NotImplementedError(documentation_only_message(self.name))

    def validate_policy(self, candidate: dict[str, Any]) -> dict[str, Any]:
        raise NotImplementedError(documentation_only_message(self.name))

    def get_required_disclosures(self) -> list[str]:
        raise NotImplementedError(documentation_only_message(self.name))


class AliExpressLiveAdapter(DisabledLiveMerchantAdapter):
    name = "AliExpressLiveAdapter"


class TemuLiveAdapter(DisabledLiveMerchantAdapter):
    name = "TemuLiveAdapter"


class AmazonLiveAdapter(DisabledLiveMerchantAdapter):
    name = "AmazonLiveAdapter"


class IHerbLiveAdapter(DisabledLiveMerchantAdapter):
    name = "IHerbLiveAdapter"


def documentation_only_message(adapter_name: str) -> str:
    return f"{adapter_name} is documentation-only in this phase."
