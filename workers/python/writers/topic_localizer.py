from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from workers.python.common import DATA, read_json, slugify, write_json

TOPIC_ARTICLES_PATH = DATA / "exports" / "topic_articles.json"
LOCALIZED_TOPIC_ARTICLES_PATH = DATA / "exports" / "localized_topic_articles.json"


def localize_topic_article(article_id: str | None = None, locale: str | None = None) -> str:
    articles = read_json(TOPIC_ARTICLES_PATH, {"articles": []}).get("articles", [])
    target_locales = [locale] if locale else ["es", "pt-br"]
    localized = read_json(LOCALIZED_TOPIC_ARTICLES_PATH, {"articles": []}).get("articles", [])
    localized_by_id = {article["id"]: article for article in localized}

    for article in articles:
        if article_id and article.get("id") != article_id:
            continue
        for target_locale in target_locales:
            if target_locale == article.get("locale"):
                continue
            localized_id = f"{article['id']}-{target_locale}"
            localized_by_id[localized_id] = {
                **article,
                "id": localized_id,
                "sourceArticleId": article["id"],
                "sourceLocale": article.get("locale"),
                "locale": target_locale,
                "slug": f"{slugify(str(article.get('slug')))}-{target_locale}",
                "title": localized_title(str(article.get("title")), target_locale),
                "h1": localized_title(str(article.get("h1")), target_locale),
                "publishStatus": "pending",
                "indexStatus": "noindex",
                "translationStatus": "localized",
                "localizationDepthScore": 45,
                "localizedAt": datetime.now(timezone.utc).isoformat(),
            }

    return str(write_json(LOCALIZED_TOPIC_ARTICLES_PATH, {"articles": list(localized_by_id.values())}))


def localized_title(title: str, locale: str) -> str:
    prefix = {"es": "Borrador localizado", "pt-br": "Rascunho localizado"}.get(locale, "Localized draft")
    return f"{prefix}: {title}"
