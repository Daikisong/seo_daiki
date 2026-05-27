from __future__ import annotations

import unittest

from workers.python.writers.multilingual_groups import create_group_record, localized_variant, upsert_localized_variant
from workers.python.writers.multilingual_hreflang import build_hreflang_groups, hreflang_key
from workers.python.writers.multilingual_scoring import (
    index_status_for_localization,
    localization_depth_score,
    score_translation_payload,
)


class MultilingualPublishingModulesTest(unittest.TestCase):
    def test_group_and_variant_records_keep_translation_drafts_noindex(self) -> None:
        group = create_group_record("article-1", "topic-1", "en", lambda: "2026-05-28T00:00:00Z")
        variant = localized_variant("article-1", "pt-br", "en")

        self.assertEqual(group["id"], "tg-article-1")
        self.assertEqual(group["variants"][0]["indexStatus"], "index")
        self.assertEqual(variant["articleId"], "article-1-pt-br")
        self.assertEqual(variant["indexStatus"], "noindex")
        self.assertTrue(variant["translationOnly"])

    def test_upsert_localized_variant_replaces_same_locale(self) -> None:
        group = create_group_record("article-1", None, "en", lambda: "created")
        upsert_localized_variant(group, "article-1", "es", "en", lambda: "updated")
        upsert_localized_variant(group, "article-1", "es", "en", lambda: "updated-again")

        self.assertEqual([variant["locale"] for variant in group["variants"]], ["en", "es"])
        self.assertEqual(group["updatedAt"], "updated-again")

    def test_localization_scoring_blocks_translation_only_indexing(self) -> None:
        self.assertEqual(localization_depth_score({"sourceLocale": None}), 100)
        self.assertEqual(localization_depth_score({"sourceLocale": "en", "translationOnly": True}), 45)
        self.assertEqual(index_status_for_localization(85, True), "pending")
        self.assertEqual(index_status_for_localization(85, False), "index")

        payload = {"groups": [create_group_record("article-1", None, "en", lambda: "created")]}
        payload["groups"][0]["variants"].append({"articleId": "article-1-es", "locale": "es", "sourceLocale": "en"})
        results = score_translation_payload(payload, lambda: "scored")

        self.assertEqual(len(results), 2)
        self.assertEqual(payload["groups"][0]["updatedAt"], "scored")
        self.assertEqual(results[1]["indexStatus"], "pending")

    def test_hreflang_export_uses_pt_br_key_and_x_default(self) -> None:
        group = create_group_record("article-1", None, "en", lambda: "created")
        group["variants"].append(localized_variant("article-1", "pt-br", "en"))
        hreflang = build_hreflang_groups({"groups": [group]})[0]["hreflangMap"]

        self.assertEqual(hreflang_key("pt-br"), "pt-BR")
        self.assertIn("en", hreflang)
        self.assertIn("pt-BR", hreflang)
        self.assertEqual(hreflang["x-default"], hreflang["en"])


if __name__ == "__main__":
    unittest.main()
