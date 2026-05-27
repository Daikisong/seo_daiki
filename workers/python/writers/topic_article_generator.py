from __future__ import annotations

from workers.python.common import read_json, write_json
from workers.python.writers.llm_provider import get_provider
from workers.python.writers.topic_article_inputs import (
    TOPIC_ARTICLES_PATH,
    filter_briefs,
    load_content_briefs,
    load_placement_candidates,
    placements_for_brief,
)
from workers.python.writers.topic_article_markdown import write_markdown_article
from workers.python.writers.topic_article_model import build_topic_article, computed_quality_score, topic_article_prompt


def generate_topic_article(topic_id: str | None = None, brief_id: str | None = None, locale: str | None = None) -> str:
    briefs = filter_briefs(load_content_briefs(), topic_id=topic_id, brief_id=brief_id, locale=locale)
    placements = load_placement_candidates()
    provider = get_provider()
    articles = []

    for brief in briefs:
        matching_placements = placements_for_brief(placements, brief)
        prompt = topic_article_prompt(brief, matching_placements)
        generated_note = provider.generate(prompt)
        article = build_topic_article(brief, matching_placements, generated_note)
        articles.append(article)
        write_markdown_article(article)

    existing = read_json(TOPIC_ARTICLES_PATH, {"articles": []}).get("articles", [])
    existing_by_id = {article["id"]: article for article in existing}
    for article in articles:
        existing_by_id[article["id"]] = article

    return str(write_json(TOPIC_ARTICLES_PATH, {"articles": list(existing_by_id.values())}))
