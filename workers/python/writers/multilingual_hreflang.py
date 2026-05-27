from __future__ import annotations

from typing import Any

from workers.python.common import slugify


def build_hreflang_groups(payload: dict[str, list[dict[str, Any]]]) -> list[dict[str, Any]]:
    groups = []
    for group in payload["groups"]:
        alternates = {}
        for variant in group["variants"]:
            alternates[hreflang_key(str(variant["locale"]))] = article_url_for_variant(variant)
        alternates["x-default"] = alternates.get("en") or next(iter(alternates.values()), "https://example.com/")
        groups.append(
            {
                "groupId": group["id"],
                "sourceArticleId": group.get("sourceArticleId"),
                "hreflangMap": alternates,
                "variantCount": len(group["variants"]),
            }
        )
    return groups


def article_url_for_variant(variant: dict[str, Any]) -> str:
    locale = str(variant["locale"])
    article_id = slugify(str(variant["articleId"]))
    return f"https://example.com/{locale}/localized/{article_id}/"


def hreflang_key(locale: str) -> str:
    return "pt-BR" if locale == "pt-br" else locale
