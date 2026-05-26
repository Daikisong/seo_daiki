from __future__ import annotations

from pathlib import Path

from workers.python.common import DATA, read_csv, slugify, write_json


def generate_url_inventory(file: Path | None = None) -> str:
    plan_path = file or DATA / "seeds" / "initial-url-plan.csv"
    rows = read_csv(plan_path)
    inventory = []
    for row in rows:
        count = int(row["count"])
        index_target = int(row["index_target"])
        for number in range(1, count + 1):
            status = "index_candidate" if number <= index_target else "pending"
            slug = slugify(f"{row['cluster']} {row['type']} {number}")
            inventory.append(
                {
                    "locale": row["locale"],
                    "type": row["type"],
                    "slug": slug,
                    "path": build_path(row["locale"], row["type"], slug),
                    "status": status,
                    "cluster": row["cluster"]
                }
            )
    return str(write_json(DATA / "exports" / "initial_url_inventory.json", inventory))


def build_path(locale: str, article_type: str, slug: str) -> str:
    if article_type == "hub":
        return f"/{locale}/{slug}/"
    if article_type == "review":
        section = {"en": "reviews", "es": "resenas", "pt-br": "analises"}.get(locale, "reviews")
    elif article_type == "guide":
        section = {"en": "guides", "es": "guias", "pt-br": "guias"}.get(locale, "guides")
    elif article_type == "risk":
        section = "risk"
    else:
        section = article_type
    return f"/{locale}/{section}/{slug}/"
