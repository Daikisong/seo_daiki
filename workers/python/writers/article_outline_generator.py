from __future__ import annotations

from workers.python.common import DATA, read_json, slugify, write_json
from workers.python.writers.article_outline_rules import build_outline_for_pack


def generate_outline(locale: str, article_type: str, product_id: str | None = None) -> str:
    packs = read_json(DATA / "evidence_packs" / f"{locale}.json", [])
    selected_packs = [
        pack
        for pack in packs
        if isinstance(pack, dict) and (product_id is None or str(pack.get("product_id")) == product_id)
    ]
    outlines = [build_outline_for_pack(pack, locale, article_type) for pack in selected_packs]
    suffix = f"-{slugify(product_id)}" if product_id else ""
    path = DATA / "outlines" / f"{locale}-{article_type}{suffix}.json"
    write_json(
        path,
        {
            "locale": locale,
            "article_type": article_type,
            "product_id": product_id,
            "outline_count": len(outlines),
            "outlines": outlines
        }
    )
    return str(path)
