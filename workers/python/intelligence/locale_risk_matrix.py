from __future__ import annotations

from workers.python.common import DATA, read_json, write_json


def build_locale_risk() -> str:
    candidates = read_json(DATA / "raw" / "raw_product_candidates.json", [])
    risks = []
    for item in candidates:
        for locale, country, customs, plug, returns in [
            ("en", "US", "low", "low", "medium"),
            ("es", "ES", "medium", "medium", "medium"),
            ("pt-br", "BR", "high", "medium", "high")
        ]:
            risks.append(
                {
                    "product_id": item["product_id"],
                    "locale": locale,
                    "country": country,
                    "plug_risk": plug,
                    "customs_risk": customs,
                    "certification_risk": "medium",
                    "return_risk": returns,
                    "local_alternative_note": "Compare local marketplace pricing when shipping or returns dominate.",
                    "score": 0.7 if customs == "high" else 0.5
                }
            )
    path = write_json(DATA / "snapshots" / "locale_risk_matrix.json", risks)
    return str(path)
