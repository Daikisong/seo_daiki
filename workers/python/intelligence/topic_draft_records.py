from __future__ import annotations

from typing import Any


def topic_draft_lines(brief: dict[str, Any]) -> list[str]:
    lines = [
        f"# {brief['titleCandidate']}",
        "",
        f"Locale: {brief['locale']}",
        f"Article type: {brief['articleType']}",
        f"Search intent: {brief['searchIntent']}",
        f"Health sensitivity: {brief['healthSensitivity']}",
        "",
        "## Required evidence",
        *(f"- {item}" for item in brief.get("requiredEvidence", [])),
        "",
        "## Outline",
        *(f"- {section['heading']}: {section['purpose']}" for section in brief.get("outlineJson", [])),
        "",
        "## Drafting guardrails",
        "- Use only collected trend signals, evidence packs, offer data, and Search Console context.",
        "- Keep the page noindex until the publishing gate passes.",
        "- Use rel=\"sponsored nofollow\" for affiliate placements.",
    ]
    if brief.get("healthSensitivity") != "none":
        lines.extend(
            [
                "- Include a visible health disclaimer.",
                "- Do not make cure, treatment, prevention, guaranteed, or unsupported medical claims.",
                "- Require manual compliance approval before indexing.",
            ]
        )
    return lines
