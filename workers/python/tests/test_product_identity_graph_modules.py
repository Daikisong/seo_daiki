from __future__ import annotations

import unittest

from workers.python.intelligence import product_identity_graph
from workers.python.intelligence.product_identity_normalization import normalize_candidate
from workers.python.intelligence.product_identity_records import identity_graph_records
from workers.python.intelligence.product_identity_scoring import duplicate_candidate, identity_score
from workers.python.intelligence.product_identity_values import is_spec_token, tokenize


class ProductIdentityGraphModuleTests(unittest.TestCase):
    def test_legacy_module_reexports_split_identity_helpers(self) -> None:
        self.assertIs(product_identity_graph.normalize_candidate, normalize_candidate)
        self.assertIs(product_identity_graph.identity_graph_records, identity_graph_records)
        self.assertIs(product_identity_graph.identity_score, identity_score)
        self.assertIs(product_identity_graph.tokenize, tokenize)

    def test_normalize_candidate_extracts_identity_tokens(self) -> None:
        normalized = normalize_candidate(
            {
                "product_id": "prod-1",
                "title": "Baseus 65W GaN USB C Charger A1",
                "image_url": "https://cdn.example.com/images/baseus-65w.jpg",
                "seller": "Baseus Official Store",
            }
        )

        self.assertEqual(normalized["_brand_token"], "baseus")
        self.assertIn("65w", normalized["_spec_tokens"])
        self.assertIn("gan", normalized["_spec_tokens"])
        self.assertIn("a1", normalized["_model_tokens"])
        self.assertEqual(normalized["_image_fingerprint"], "baseus-65w")
        self.assertEqual(normalized["_seller_tokens"], ["baseus", "official", "store"])

    def test_identity_score_rewards_matching_brand_specs_image_and_seller(self) -> None:
        left = normalize_candidate(
            {
                "product_id": "prod-1",
                "title": "Baseus 65W GaN USB C Charger A1",
                "category": "charger",
                "image_url": "https://cdn.example.com/baseus-65w.jpg",
                "seller": "Baseus Official Store",
            }
        )
        right = normalize_candidate(
            {
                "product_id": "prod-2",
                "title": "Baseus 65W GaN Charger A1",
                "category": "charger",
                "image_url": "https://cdn.example.com/baseus-65w.jpg",
                "seller": "Baseus Official Store",
            }
        )

        score = identity_score(left, right)

        self.assertGreaterEqual(score["confidence"], 0.78)
        self.assertEqual(score["score_parts"]["image_hash"], 1.0)
        self.assertEqual(score["score_parts"]["brand_token"], 1.0)

    def test_identity_score_caps_category_mismatch(self) -> None:
        left = normalize_candidate({"title": "Baseus 65W Charger", "category": "charger"})
        right = normalize_candidate({"title": "Baseus 65W Charger", "category": "cable"})

        self.assertLessEqual(identity_score(left, right)["confidence"], 0.49)

    def test_duplicate_candidate_marks_same_brand_different_spec(self) -> None:
        source = normalize_candidate({"product_id": "prod-1", "title": "Baseus 65W Charger", "category": "charger"})
        candidate = normalize_candidate({"product_id": "prod-2", "title": "Baseus 100W Charger", "category": "charger"})

        duplicate = duplicate_candidate(source, candidate)

        self.assertEqual(duplicate["decision"], "same_brand_different_spec")
        self.assertEqual(duplicate["score_parts"]["spec_token"], 0.0)

    def test_identity_graph_records_groups_duplicates_and_picks_canonical(self) -> None:
        graph = identity_graph_records(
            [
                {
                    "product_id": "prod-1",
                    "title": "Baseus 65W GaN Charger A1",
                    "category": "charger",
                    "image_url": "https://cdn.example.com/baseus-65w.jpg",
                    "seller": "Baseus Official Store",
                    "orders": 100,
                    "rating": 4.7,
                    "price": 20,
                },
                {
                    "product_id": "prod-2",
                    "title": "Baseus 65W GaN USB C Charger A1",
                    "category": "charger",
                    "image_url": "https://cdn.example.com/baseus-65w.jpg",
                    "seller": "Baseus Official Store",
                    "orders": 250,
                    "rating": 4.8,
                    "price": 22,
                },
            ]
        )

        self.assertEqual(len(graph), 1)
        self.assertEqual(graph[0]["canonical_product"]["product_id"], "prod-2")
        self.assertEqual(graph[0]["source_product_ids"], ["prod-1", "prod-2"])
        self.assertGreaterEqual(graph[0]["confidence"], 0.78)

    def test_spec_token_detection_keeps_existing_thresholds(self) -> None:
        self.assertTrue(is_spec_token("65w"))
        self.assertTrue(is_spec_token("gan"))
        self.assertFalse(is_spec_token("charger"))


if __name__ == "__main__":
    unittest.main()
