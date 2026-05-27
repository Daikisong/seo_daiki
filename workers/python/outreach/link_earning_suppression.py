from __future__ import annotations

from pathlib import Path

from workers.python.common import read_csv
from workers.python.outreach.link_earning_paths import SUPPRESSION_LIST_PATH
from workers.python.outreach.link_earning_rules import clean, normalize_domain


def suppression_entries(path: Path = SUPPRESSION_LIST_PATH) -> list[dict[str, str]]:
    if not path.exists():
        return []
    entries = []
    for row in read_csv(path):
        email = clean(row.get("email")).lower()
        domain = normalize_domain(row.get("domain"))
        if not email and not domain:
            continue
        entries.append({"email": email, "domain": domain, "reason": clean(row.get("reason")) or "suppressed"})
    return entries
