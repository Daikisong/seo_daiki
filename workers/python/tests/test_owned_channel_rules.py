from __future__ import annotations

import unittest

from workers.python.distribution.owned_channel_rules import (
    asset_types_for_platform,
    body_for_platform,
    dedupe_articles,
    distribution_asset,
    distribution_asset_priority,
    distribution_priority,
    distribution_rule_from_row,
    normalize_article,
)


class OwnedChannelRulesTest(unittest.TestCase):
    def test_normalize_article_marks_affiliate_heavy_types(self) -> None:
        review = normalize_article({"id": "article-1", "locale": "en", "type": "review", "slug": "charger", "title": "Charger"})
        guide = normalize_article({"id": "article-2", "locale": "es", "type": "guide", "slug": "guia", "affiliatePlacementCandidates": [{}]})

        self.assertEqual(review["path"], "/en/charger/")
        self.assertTrue(review["hasAffiliate"])
        self.assertTrue(guide["hasAffiliate"])

    def test_dedupe_keeps_highest_distribution_priority_for_same_path(self) -> None:
        articles = [
            {"id": "review-a", "path": "/en/charger/", "type": "review", "hasAffiliate": True},
            {"id": "data-a", "path": "/en/charger/", "type": "data", "hasAffiliate": False},
            {"id": "guide-a", "path": "/en/guide/", "type": "guide", "hasAffiliate": False},
        ]

        deduped = dedupe_articles(articles)
        self.assertEqual([article["id"] for article in deduped], ["data-a", "guide-a"])
        self.assertLess(distribution_priority({"type": "data", "id": "data-a"}), distribution_priority({"type": "review", "id": "review-a", "hasAffiliate": True}))

    def test_rule_parsing_defaults_to_safe_human_approval(self) -> None:
        rule = distribution_rule_from_row({
            "platform": "reddit",
            "locale": "",
            "max_posts_per_day": "0",
            "requires_human_approval": "",
            "allow_direct_link": "false",
            "require_disclosure": "",
            "enabled": "false",
        })

        self.assertEqual(rule["locale"], "en")
        self.assertTrue(rule["requiresHumanApproval"])
        self.assertFalse(rule["allowDirectLink"])
        self.assertTrue(rule["requireDisclosure"])
        self.assertFalse(rule["enabled"])

    def test_distribution_asset_applies_link_and_disclosure_rules(self) -> None:
        article = {
            "id": "article-1",
            "locale": "en",
            "title": "Very long title " * 20,
            "summary": "Evidence checklist",
            "path": "/en/data/charger/",
            "hasAffiliate": True,
        }
        rule = {
            "platform": "linkedin",
            "allowDirectLink": True,
            "requireDisclosure": True,
            "requiresHumanApproval": True,
        }

        asset = distribution_asset(article, rule, "linkedin_post", "2026-05-27T00:00:00+00:00")
        self.assertEqual(asset["id"], "distribution-article-1-linkedin-linkedin-post")
        self.assertEqual(asset["targetUrl"], "/en/data/charger/")
        self.assertIn("affiliate links", asset["disclosure"])
        self.assertTrue(asset["requiresHumanApproval"])
        self.assertLessEqual(len(asset["title"]), 120)

    def test_asset_types_and_bodies_keep_platform_specific_outputs(self) -> None:
        self.assertEqual(asset_types_for_platform("reddit"), ["reddit_draft"])
        self.assertEqual(asset_types_for_platform("unknown"), ["unknown_draft"])
        self.assertIn("Short script", body_for_platform("youtube", "Title", "Summary", "/en/data/x/"))
        self.assertIn("owned-channel pin draft", body_for_platform("pinterest", "Title", "Summary", None))
        self.assertIn("no direct affiliate link", body_for_platform("x", "Title", "Summary", "/en/data/x/"))

    def test_asset_priority_prefers_data_then_guide_then_affiliate_disclosure(self) -> None:
        data = {"targetUrl": "/en/data/charger/", "articleId": "a", "platform": "x"}
        guide = {"targetUrl": "/en/guides/charger/", "articleId": "b", "platform": "x"}
        affiliate = {"targetUrl": "/en/reviews/charger/", "articleId": "c", "platform": "x", "disclosure": "Contains affiliate links"}

        self.assertLess(distribution_asset_priority(data), distribution_asset_priority(guide))
        self.assertLess(distribution_asset_priority(guide), distribution_asset_priority(affiliate))


if __name__ == "__main__":
    unittest.main()
