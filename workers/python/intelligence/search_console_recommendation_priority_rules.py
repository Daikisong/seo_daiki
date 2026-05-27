from __future__ import annotations

from workers.python.intelligence.search_console_page_rules import LOW_CTR_THRESHOLD


def _priority(
    row: dict[str, object],
    missing_terms: list[str],
    link_candidates: list[dict[str, object]],
    section_match: dict[str, object],
) -> int:
    impressions = float(row.get("impressions") or 0)
    ctr = float(row.get("ctr") or 0)
    position = float(row.get("position") or 0)
    ctr_gap = max(0, LOW_CTR_THRESHOLD - ctr)
    position_boost = max(0, 31 - position)
    section_gap = 1 - float(section_match.get("score") or 0)
    return round(impressions * ctr_gap + position_boost + len(missing_terms) * 2 + len(link_candidates) + section_gap * 10)
