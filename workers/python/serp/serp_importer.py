from __future__ import annotations

from pathlib import Path

from workers.python.common import DATA, read_csv, read_json, write_json
from workers.python.serp.serp_artifacts import SERP_RESULTS_PATH, now
from workers.python.serp.serp_import_records import (
    keyword_id_for_row,
    serp_import_payload,
    serp_result_record,
    serp_snapshot_record,
    snapshot_id_for_row,
    snapshot_identity,
    sorted_serp_results,
)
from workers.python.serp.serp_import_reports import (
    SERP_CONTENT_FETCH_POLICY,
    collect_serp_report_payload,
    fetched_serp_result_record,
    fetched_serp_result_rows,
)


def import_serp_results(file: Path | None = None) -> str:
    seed_path = file or DATA / "seeds" / "serp-results.csv"
    rows = read_csv(seed_path)
    return str(write_json(SERP_RESULTS_PATH, serp_import_payload(rows, seed_path, now)))


def collect_serp(keyword_id: str | None = None, provider: str = "manual_csv") -> str:
    payload = read_json(SERP_RESULTS_PATH, {"snapshots": [], "results": []})
    return str(write_json(DATA / "exports" / "serp_collect_report.json", collect_serp_report_payload(payload, keyword_id, provider)))


def fetch_serp_pages(snapshot_id: str | None = None) -> str:
    payload = read_json(SERP_RESULTS_PATH, {"snapshots": [], "results": []})
    updated = fetched_serp_result_rows(payload.get("results", []), snapshot_id)
    return str(write_json(SERP_RESULTS_PATH, {"snapshots": payload.get("snapshots", []), "results": updated}))
