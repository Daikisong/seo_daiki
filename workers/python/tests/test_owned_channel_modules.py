from __future__ import annotations

import unittest

from workers.python.distribution import owned_channel
from workers.python.distribution.owned_channel_delivery import distribution_send_decision, distribution_send_result
from workers.python.distribution.owned_channel_sources import (
    distribution_rules_from_rows,
    inventory_article_from_row,
    inventory_articles_from_rows,
    source_articles_from_payloads,
)


class OwnedChannelModulesTest(unittest.TestCase):
    def test_owned_channel_facade_uses_split_modules(self) -> None:
        self.assertIs(owned_channel.distribution_send_decision, distribution_send_decision)
        self.assertIs(owned_channel.distribution_send_result, distribution_send_result)

    def test_inventory_article_rows_filter_and_normalize_index_candidates(self) -> None:
        rows = [
            {"status": "draft", "type": "guide", "slug": "skip-me", "path": "/en/skip-me/"},
            {"status": "index_candidate", "type": "review", "slug": "charger", "path": "/en/reviews/charger/", "cluster": "USB chargers"},
        ]

        articles = inventory_articles_from_rows(rows)

        self.assertEqual(len(articles), 1)
        self.assertEqual(articles[0]["id"], "url-en-reviews-charger")
        self.assertEqual(articles[0]["summary"], "USB chargers")
        self.assertTrue(articles[0]["hasAffiliate"])
        self.assertEqual(inventory_article_from_row(rows[1])["title"], "review charger")

    def test_source_articles_prefers_stronger_inventory_page_for_same_path(self) -> None:
        topic_articles = [{"id": "topic-1", "locale": "en", "type": "review", "slug": "charger", "title": "Charger review"}]
        inventory = [
            {
                "status": "index_candidate",
                "type": "data",
                "slug": "charger",
                "path": "/en/charger/",
                "cluster": "Lab-backed charger dataset",
            }
        ]

        articles = source_articles_from_payloads(topic_articles, [], inventory)

        self.assertEqual(len([article for article in articles if article.get("path") == "/en/charger/"]), 1)
        self.assertEqual(articles[0]["type"], "data")
        self.assertEqual(articles[0]["summary"], "Lab-backed charger dataset")

    def test_distribution_rules_from_rows_defaults_to_safe_flags(self) -> None:
        rules = distribution_rules_from_rows([
            {"platform": "linkedin", "locale": "en", "allow_direct_link": "false", "enabled": "true"}
        ])

        self.assertEqual(rules[0]["platform"], "linkedin")
        self.assertFalse(rules[0]["allowDirectLink"])
        self.assertTrue(rules[0]["requiresHumanApproval"])
        self.assertTrue(rules[0]["enabled"])

    def test_distribution_send_decision_blocks_live_sending_by_default(self) -> None:
        self.assertEqual(distribution_send_decision({"platform": "reddit"}, True, True)[0], "skipped_reddit_draft_only")
        self.assertEqual(distribution_send_decision({"platform": "x"}, False, True)[0], "skipped_disabled")
        self.assertEqual(distribution_send_decision({"platform": "x"}, True, False)[0], "blocked_missing_adapter")
        self.assertEqual(distribution_send_decision({"platform": "x"}, True, True)[0], "blocked_not_implemented")

        result = distribution_send_result({"id": "asset-1", "platform": "x"}, "skipped_disabled", "disabled", "2026-05-28T00:00:00+00:00")
        self.assertEqual(result["assetId"], "asset-1")
        self.assertEqual(result["capturedAt"], "2026-05-28T00:00:00+00:00")


if __name__ == "__main__":
    unittest.main()
