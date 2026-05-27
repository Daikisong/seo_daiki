from __future__ import annotations

from workers.python.common import DATA, read_json
from workers.python.intelligence.search_console_rules import _terms

LOCALIZATION_SCORES_PATH = DATA / "exports" / "localization_scores.json"
LOCALIZED_TOPIC_ARTICLES_PATH = DATA / "exports" / "localized_topic_articles.json"
GENERIC_LOCALIZATION_TERMS = {"article", "brief", "buyer", "draft", "evidence", "first", "guide"}


def localization_improvement_candidates(
    page: str,
    locale: str,
    scores: list[dict[str, object]] | None = None,
    localized_articles: list[dict[str, object]] | None = None,
) -> list[dict[str, object]]:
    score_rows = scores if scores is not None else _localization_scores()
    article_rows = localized_articles if localized_articles is not None else _localized_articles()
    candidates = []
    seen: set[tuple[object, object]] = set()
    page_terms = _content_terms(page)

    for score in score_rows:
        if not isinstance(score, dict) or score.get("locale") == locale:
            continue
        if not page_terms.intersection(_content_terms(str(score.get("articleId") or ""))):
            continue
        depth = float(score.get("localizationDepthScore") or 0)
        key = (score.get("locale"), score.get("articleId"))
        if depth < 80 and key not in seen:
            seen.add(key)
            candidates.append(
                {
                    "locale": score.get("locale"),
                    "articleId": score.get("articleId"),
                    "localizationDepthScore": depth,
                    "reason": "localized page below index depth threshold",
                }
            )

    for article in article_rows:
        if not isinstance(article, dict) or article.get("locale") == locale:
            continue
        article_terms = _content_terms(" ".join([str(article.get("id", "")), str(article.get("slug", "")), str(article.get("topicId", ""))]))
        if not page_terms.intersection(article_terms):
            continue
        depth = float(article.get("localizationDepthScore") or 0)
        key = (article.get("locale"), article.get("id"))
        if depth < 80 and key not in seen:
            seen.add(key)
            candidates.append(
                {
                    "locale": article.get("locale"),
                    "articleId": article.get("id"),
                    "localizationDepthScore": depth,
                    "reason": f"localized draft for {page} needs local market notes and offer fit",
                }
            )
    return candidates[:5]


def _content_terms(value: str) -> set[str]:
    return set(_terms(value)) - GENERIC_LOCALIZATION_TERMS


def _localization_scores() -> list[dict[str, object]]:
    return read_json(LOCALIZATION_SCORES_PATH, {"results": []}).get("results", [])


def _localized_articles() -> list[dict[str, object]]:
    return read_json(LOCALIZED_TOPIC_ARTICLES_PATH, {"articles": []}).get("articles", [])
