from __future__ import annotations

from typing import Any

from workers.python.common import DATA, read_json, write_json

MARKETS_PATH = DATA / "config" / "markets.json"
TREND_CLUSTERS_PATH = DATA / "exports" / "trend_clusters.json"
TREND_KEYWORDS_PATH = DATA / "exports" / "trend_keywords.json"
CONTENT_STRATEGIES_PATH = DATA / "exports" / "content_strategies.json"
TEST_ARTICLES_PATH = DATA / "exports" / "test_articles.json"
CALENDAR_PATH = DATA / "exports" / "market_editorial_calendars.json"
CALENDAR_REPORT_PATH = DATA / "exports" / "market_calendar_report.json"
CALENDAR_EXPORT_PATH = DATA / "exports" / "market_calendar_export.json"


def load_calendar_inputs() -> dict[str, list[dict[str, Any]]]:
    return {
        "markets": _dict_list(read_json(MARKETS_PATH, [])),
        "clusters": _dict_list(read_json(TREND_CLUSTERS_PATH, {"clusters": []}).get("clusters", [])),
        "keywords": _dict_list(read_json(TREND_KEYWORDS_PATH, {"keywords": []}).get("keywords", [])),
        "strategies": _dict_list(read_json(CONTENT_STRATEGIES_PATH, {"strategies": []}).get("strategies", [])),
        "articles": _dict_list(read_json(TEST_ARTICLES_PATH, {"articles": []}).get("articles", [])),
    }


def read_market_calendars() -> list[dict[str, Any]]:
    payload = read_json(CALENDAR_PATH, {"calendars": []})
    return _dict_list(payload.get("calendars", []))


def write_market_calendars(calendars: list[dict[str, Any]]) -> str:
    return str(write_json(CALENDAR_PATH, {"calendars": calendars}))


def write_market_calendar_report(calendars: list[dict[str, Any]], explanations: list[dict[str, Any]]) -> str:
    return str(write_json(CALENDAR_REPORT_PATH, {"calendars": calendars, "explanations": explanations}))


def export_market_calendar_payload() -> str:
    return str(write_json(CALENDAR_EXPORT_PATH, read_json(CALENDAR_PATH, {"calendars": []})))


def _dict_list(value: object) -> list[dict[str, Any]]:
    return [item for item in value if isinstance(item, dict)] if isinstance(value, list) else []
