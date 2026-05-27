from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

from workers.python.common import DATA, read_csv, read_json, write_json
from workers.python.intelligence.trend_topic_records import (
    affiliate_offer_match_records,
    content_brief_records,
    publishing_gate_records,
    topic_cluster_payload,
    topic_draft_lines,
    topic_localization_records,
    topic_score_payload,
    trend_import_payload,
)

TREND_SIGNALS_PATH = DATA / "snapshots" / "trend_signals.json"
TOPIC_CLUSTERS_PATH = DATA / "snapshots" / "topic_clusters.json"
TOPIC_SCORES_PATH = DATA / "snapshots" / "topic_scores.json"
CONTENT_BRIEFS_PATH = DATA / "briefs" / "content_briefs.json"
OFFER_MATCHES_PATH = DATA / "snapshots" / "affiliate_offer_matches.json"
TOPIC_DRAFTS_REPORT_PATH = DATA / "exports" / "topic_drafts.json"
TOPIC_LOCALIZATION_REPORT_PATH = DATA / "exports" / "topic_localizations.json"
PUBLISHING_GATE_PATH = DATA / "exports" / "topic_publishing_gate.json"


def collect_trend_signals(file: Path | None = None) -> str:
    seed_path = file or DATA / "seeds" / "trend-signals.csv"
    return import_trend_signals(seed_path)


def import_trend_signals(file: Path | None = None) -> str:
    seed_path = file or DATA / "seeds" / "trend-signals.csv"
    rows = read_csv(seed_path)
    return str(write_json(TREND_SIGNALS_PATH, trend_import_payload(rows, seed_path, now())))


def cluster_topics() -> str:
    payload = read_json(TREND_SIGNALS_PATH, {"signals": []})
    return str(write_json(TOPIC_CLUSTERS_PATH, topic_cluster_payload(payload.get("signals", []))))


def score_topics() -> str:
    cluster_payload = read_json(TOPIC_CLUSTERS_PATH, {"topics": [], "topicSignals": []})
    signal_payload = read_json(TREND_SIGNALS_PATH, {"signals": []})
    return str(write_json(TOPIC_SCORES_PATH, topic_score_payload(cluster_payload, signal_payload.get("signals", []))))


def generate_content_briefs() -> str:
    payload = read_json(TOPIC_SCORES_PATH, {"topics": []})
    return str(write_json(CONTENT_BRIEFS_PATH, {"briefs": content_brief_records(payload.get("topics", []))}))


def match_affiliate_offers() -> str:
    payload = read_json(TOPIC_SCORES_PATH, {"topics": []})
    return str(write_json(OFFER_MATCHES_PATH, {"matches": affiliate_offer_match_records(payload.get("topics", []))}))


def generate_topic_draft(locale: str | None = None) -> str:
    payload = read_json(CONTENT_BRIEFS_PATH, {"briefs": []})
    briefs = [brief for brief in payload.get("briefs", []) if not locale or brief.get("locale") == locale]
    generated = []
    for brief in briefs:
        path = DATA / "drafts" / f"topic-{brief['locale']}-{brief['articleType']}-{brief['topicId'].replace('topic-', '')}.md"
        lines = topic_draft_lines(brief)
        path.write_text("\n".join(lines), encoding="utf-8")
        generated.append({"briefId": brief["id"], "path": str(path)})

    return str(write_json(TOPIC_DRAFTS_REPORT_PATH, {"drafts": generated}))


def localize_topic_draft(target_locales: list[str] | None = None) -> str:
    payload = read_json(CONTENT_BRIEFS_PATH, {"briefs": []})
    locales = target_locales or ["en", "es", "pt-br"]
    return str(write_json(TOPIC_LOCALIZATION_REPORT_PATH, {"localizations": topic_localization_records(payload.get("briefs", []), locales)}))


def run_publishing_gate() -> str:
    briefs_payload = read_json(CONTENT_BRIEFS_PATH, {"briefs": []})
    matches_payload = read_json(OFFER_MATCHES_PATH, {"matches": []})
    results = publishing_gate_records(briefs_payload.get("briefs", []), matches_payload.get("matches", []))

    return str(write_json(PUBLISHING_GATE_PATH, {"results": results}))


def now() -> str:
    return datetime.now(timezone.utc).isoformat()
