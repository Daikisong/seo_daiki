from __future__ import annotations

from collections import defaultdict

from workers.python.validators.common import ValidationIssue, issue


def validate_internal_link_inventory(inventory: list[dict[str, object]]) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    by_locale_cluster: dict[tuple[str, str], list[dict[str, object]]] = defaultdict(list)

    for row in inventory:
        by_locale_cluster[(str(row.get("locale", "")), str(row.get("cluster", "")))].append(row)

    for (locale, cluster), rows in by_locale_cluster.items():
        index_rows = [row for row in rows if row.get("status") == "index_candidate"]
        hub_rows = [row for row in index_rows if row.get("type") == "hub"]
        supporting_rows = [row for row in index_rows if row.get("type") != "hub"]

        if supporting_rows and not hub_rows:
            issues.append(
                issue(
                    "cluster_hub_missing",
                    f"{locale}/{cluster} has indexable support pages but no indexable hub.",
                )
            )

        if hub_rows and len(supporting_rows) < 3:
            issues.append(
                issue(
                    "cluster_support_depth_low",
                    f"{locale}/{cluster} hub needs at least three indexable supporting pages.",
                    "warning",
                )
            )

    return issues

