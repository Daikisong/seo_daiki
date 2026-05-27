from __future__ import annotations

MIN_IMPRESSIONS = 100
LOW_CTR_THRESHOLD = 0.02
MIN_REFRESH_POSITION = 8
MAX_REFRESH_POSITION = 30


def _is_refresh_candidate(row: dict[str, object]) -> bool:
    impressions = float(row.get("impressions") or 0)
    ctr = float(row.get("ctr") or 0)
    position = float(row.get("position") or 0)
    return (
        impressions >= MIN_IMPRESSIONS
        and ctr < LOW_CTR_THRESHOLD
        and MIN_REFRESH_POSITION <= position <= MAX_REFRESH_POSITION
    )
