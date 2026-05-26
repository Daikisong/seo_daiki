from __future__ import annotations

from workers.python.common import DATA, read_json, write_json
from workers.python.intelligence.price_truth_engine import price_truth


def build_evidence_pack(locale: str) -> str:
    candidates = read_json(DATA / "raw" / "raw_product_candidates.json", [])
    claims = read_json(DATA / "snapshots" / "seller_claims.json", [])
    traps = read_json(DATA / "snapshots" / "variant_traps.json", [])
    prices = read_json(DATA / "snapshots" / "price_snapshots.json", [])
    price_truth_rows = read_json(DATA / "snapshots" / "price_truth.json", [])
    verified_claims = read_json(DATA / "snapshots" / "verified_claims.json", [])
    risks = read_json(DATA / "snapshots" / "locale_risk_matrix.json", [])
    signals = read_json(DATA / "snapshots" / "review_signals.json", [])

    packs = []
    for item in candidates:
        product_id = item["product_id"]
        product_prices = [price for price in prices if price["product_id"] == product_id]
        product_price_truth = [row for row in price_truth_rows if row["product_id"] == product_id]
        packs.append(
            {
                "product_id": product_id,
                "locale": locale,
                "product": item,
                "variants": [trap for trap in traps if trap["product_id"] == product_id],
                "seller_claims": [claim for claim in claims if claim["product_id"] == product_id],
                "verified_claims": [claim for claim in verified_claims if claim["product_id"] == product_id],
                "review_signals": [
                    signal for signal in signals if signal["product_id"] == product_id and signal["locale"] in {locale, "en"}
                ],
                "price_snapshots": product_prices,
                "price_truth": product_price_truth or [price_truth(float(price["final_price"])) for price in product_prices],
                "market_risks": [risk for risk in risks if risk["product_id"] == product_id and risk["locale"] == locale],
                "allowed_claims": [
                    "Use seller wattage only with seller-claim labeling.",
                    "Use price zones from price_truth records.",
                    "Mention variant traps only when the detector emitted a flag."
                ],
                "forbidden_claims": [
                    "Do not say we tested unless verified_claims is non-empty.",
                    "Do not claim safety certification without certification evidence.",
                    "Do not copy review text."
                ]
            }
        )
    path = write_json(DATA / "evidence_packs" / f"{locale}.json", packs)
    return str(path)
