from __future__ import annotations

from typing import Any

from workers.python.common import DATA


def markdown_article_lines(article: dict[str, Any]) -> list[str]:
    return [
        f"# {article['title']}",
        "",
        f"Locale: {article['locale']}",
        f"Type: {article['type']}",
        f"Publish status: {article['publishStatus']}",
        f"Index status: {article['indexStatus']}",
        f"Quality score: {article['qualityScore']}",
        "",
        "## Sections",
        *(f"- {section.get('heading')}: {section.get('purpose')}" for section in article.get("sections", [])),
        "",
        "## Required evidence",
        *(f"- {item}" for item in article.get("requiredEvidence", [])),
        "",
        "## Placement candidates",
        *(f"- {placement.get('anchorText')} ({placement.get('status')})" for placement in article.get("affiliatePlacementCandidates", [])),
    ]


def write_markdown_article(article: dict[str, Any]) -> None:
    path = DATA / "drafts" / f"{article['id']}.md"
    path.write_text("\n".join(markdown_article_lines(article)), encoding="utf-8")
