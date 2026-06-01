from __future__ import annotations

from typing import Any

from workers.python.writers.content_strategy_article_experience_records import article_experience_record
from workers.python.writers.content_strategy_experience_helpers import localized_internal_links, seo_readiness_score
from workers.python.writers.content_strategy_serp_format_records import serp_format_experience
from workers.python.writers.content_strategy_topics import topic_key


def article_experience(strategy: dict[str, Any]) -> dict[str, Any]:
    topic = topic_key(strategy)
    market = str(strategy.get("market") or "")
    language = str(strategy.get("language") or "")
    slug = str(strategy.get("slug") or "")
    common_internal_links = localized_internal_links(language, market, slug)
    # Topic records provide article-specific UI data; SERP records provide format/evidence context.
    selected = {**article_experience_record(topic, common_internal_links), **serp_format_experience(topic, language)}
    for source in selected.get("sourceLinks", []):
        source.setdefault("checkedAt", "2026-05-31")
    return {
        "heroImage": selected.get("heroImage"),
        "articleMeta": selected.get("articleMeta", {}),
        "keyTakeaways": selected.get("keyTakeaways", []),
        "verdictBox": selected.get("verdictBox"),
        "prosCons": selected.get("prosCons"),
        "serpReferences": selected.get("serpReferences", []),
        "quickFacts": selected.get("quickFacts", []),
        "checklist": selected.get("checklist", []),
        "comparisonTable": selected.get("comparisonTable"),
        "sourceLinks": selected.get("sourceLinks", []),
        "internalLinks": selected.get("internalLinks", common_internal_links),
        "seoReadinessScore": seo_readiness_score(selected),
    }
