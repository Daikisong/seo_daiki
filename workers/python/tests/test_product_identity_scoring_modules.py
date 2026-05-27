from __future__ import annotations

import unittest

from workers.python.intelligence.product_identity_canonical import (
    canonical_item as direct_canonical_item,
)
from workers.python.intelligence.product_identity_canonical import (
    canonical_slug as direct_canonical_slug,
)
from workers.python.intelligence.product_identity_canonical import (
    group_confidence as direct_group_confidence,
)
from workers.python.intelligence.product_identity_duplicates import duplicate_candidate as direct_duplicate_candidate
from workers.python.intelligence.product_identity_score_parts import identity_score as direct_identity_score
from workers.python.intelligence.product_identity_scoring import (
    canonical_item,
    canonical_slug,
    duplicate_candidate,
    group_confidence,
    identity_score,
)


class ProductIdentityScoringModulesTest(unittest.TestCase):
    def test_compatibility_module_reexports_split_identity_scoring_functions(self) -> None:
        self.assertIs(canonical_item, direct_canonical_item)
        self.assertIs(canonical_slug, direct_canonical_slug)
        self.assertIs(duplicate_candidate, direct_duplicate_candidate)
        self.assertIs(group_confidence, direct_group_confidence)
        self.assertIs(identity_score, direct_identity_score)

    def test_split_modules_keep_score_duplicate_and_canonical_behavior(self) -> None:
        source = identity_row("p1", orders=10, rating=4.8, price=20)
        candidate = identity_row("p2", orders=20, rating=4.7, price=22)

        score = direct_identity_score(source, candidate)
        duplicate = direct_duplicate_candidate(source, candidate)
        canonical = direct_canonical_item([source, candidate])

        self.assertGreater(score["confidence"], 0.78)
        self.assertEqual(duplicate["decision"], "merge_candidate")
        self.assertEqual(canonical["product_id"], "p2")
        self.assertEqual(direct_group_confidence([source, candidate]), score["confidence"])
        self.assertEqual(direct_canonical_slug(source), "anker-65w-gan-chargers")


def identity_row(product_id: str, orders: int, rating: float, price: float) -> dict[str, object]:
    return {
        "product_id": product_id,
        "title": f"Anker 65W GaN Charger {product_id}",
        "category": "chargers",
        "orders": orders,
        "rating": rating,
        "price": price,
        "seller": "Anker",
        "_title_normalized": "anker 65w gan charger",
        "_brand_token": "anker",
        "_spec_tokens": ["65w", "gan"],
        "_seller_tokens": ["anker"],
        "_model_tokens": ["a2663"],
        "_image_fingerprint": "image-1",
    }


if __name__ == "__main__":
    unittest.main()
