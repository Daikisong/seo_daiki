from __future__ import annotations

from workers.python.common import DATA, write_json
from workers.python.intelligence.search_console_feedback_inputs import search_console_rows as _search_console_rows
from workers.python.intelligence.search_console_feedback_inputs import url_inventory
from workers.python.intelligence.search_console_localization_candidates import localization_improvement_candidates as _localization_improvement_candidates
from workers.python.intelligence.search_console_offer_candidates import offer_replacement_candidates as _offer_replacement_candidates
from workers.python.intelligence.search_console_rules import _is_refresh_candidate
from workers.python.intelligence.search_console_suggestion_builder import suggest_for_row as _suggest_for_row


def build_search_console_suggestions() -> str:
    rows = _search_console_rows()
    inventory = url_inventory()
    suggestions: list[dict[str, object]] = []
    for row in rows:
        if _is_refresh_candidate(row):
            suggestions.append(_suggest_for_row(row, inventory))
    suggestions.sort(key=lambda suggestion: int(suggestion.get("priority") or 0), reverse=True)
    return str(write_json(DATA / "exports" / "search_console_suggestions.json", suggestions))
