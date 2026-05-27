from __future__ import annotations

import unittest
from unittest.mock import patch

from workers.python.writers import market_content_strategy
from workers.python.writers.market_content_briefs import content_brief_records, generate_content_brief
from workers.python.writers.market_content_strategy_records import content_strategy_records, create_content_strategy
from workers.python.writers.market_test_articles import (
    generate_test_post,
    promote_index_candidate_records,
    publish_test_article_records,
    test_article_records,
)


class MarketContentStrategyModuleTests(unittest.TestCase):
    def test_legacy_module_reexports_split_content_helpers(self) -> None:
        self.assertIs(market_content_strategy.create_content_strategy, create_content_strategy)
        self.assertIs(market_content_strategy.generate_content_brief, generate_content_brief)
        self.assertIs(market_content_strategy.generate_test_post, generate_test_post)
        self.assertIs(market_content_strategy.content_strategy_records, content_strategy_records)
        self.assertIs(market_content_strategy.test_article_records, test_article_records)

    def test_content_strategy_records_use_serp_opportunity_without_monetization(self) -> None:
        with patch("workers.python.writers.market_content_strategy_records.now", return_value="2026-05-28T00:00:00+00:00"):
            strategies = content_strategy_records(
                keywords=[
                    {
                        "id": "kw-us-usb",
                        "clusterId": "cluster-us-usb",
                        "market": "us",
                        "language": "en",
                        "keyword": "usb c charger",
                    }
                ],
                clusters=[{"id": "cluster-us-usb", "category": "consumer-tech"}],
                opportunities=[
                    {
                        "keywordId": "kw-us-usb",
                        "recommendedArticleType": "comparison_test_post",
                        "recommendedAngle": "Compare charger specs before choosing.",
                        "topPatternsJson": ["Comparison tables appear"],
                        "contentGapJson": {"missingAngles": ["market-specific guidance"]},
                        "shouldWrite": True,
                    }
                ],
                analyses=[{"keyword": "usb c charger", "comparisonTablePresent": True, "originalDataPresent": False}],
            )

        self.assertEqual(len(strategies), 1)
        strategy = strategies[0]
        self.assertEqual(strategy["id"], "content-strategy-kw-us-usb")
        self.assertEqual(strategy["selectedArticleType"], "comparison_test_post")
        self.assertEqual(strategy["status"], "brief_pending")
        self.assertTrue(strategy["monetizationDeferred"])
        self.assertIn("Original data or testing plan before claiming superiority", strategy["evidenceNeededJson"])

    def test_content_brief_records_keep_forbidden_claims_and_no_link_rule(self) -> None:
        with patch("workers.python.writers.market_content_briefs.now", return_value="2026-05-28T00:00:00+00:00"):
            briefs = content_brief_records(
                [
                    {
                        "id": "content-strategy-kw-us-usb",
                        "keywordId": "kw-us-usb",
                        "clusterId": "cluster-us-usb",
                        "market": "us",
                        "language": "en",
                        "slug": "usb-c-charger",
                        "titleStrategy": "USB C Charger",
                        "recommendedAngle": "Compare charger specs before choosing.",
                        "sectionPlanJson": [{"heading": "Direct answer", "purpose": "Answer first."}],
                        "evidenceNeededJson": ["Spec verification"],
                    }
                ]
            )

        self.assertEqual(briefs[0]["id"], "brief-content-strategy-kw-us-usb")
        self.assertIn("Do not insert affiliate links in the test article.", briefs[0]["forbiddenClaimsJson"])
        self.assertIn("Product links are forbidden", briefs[0]["briefMarkdown"])

    def test_test_article_records_default_to_pending_noindex(self) -> None:
        with patch("workers.python.writers.market_test_articles.now", return_value="2026-05-28T00:00:00+00:00"):
            articles = test_article_records(
                [
                    {
                        "id": "content-strategy-kw-us-usb",
                        "market": "us",
                        "language": "en",
                        "slug": "usb-c-charger",
                        "titleStrategy": "USB C Charger",
                        "recommendedAngle": "Compare charger specs before choosing.",
                        "sectionPlanJson": [{"heading": "Direct answer", "purpose": "Answer first."}],
                    }
                ]
            )

        self.assertEqual(articles[0]["id"], "test-article-content-strategy-kw-us-usb")
        self.assertEqual(articles[0]["publishStatus"], "pending")
        self.assertEqual(articles[0]["indexStatus"], "noindex")
        self.assertEqual(articles[0]["affiliateLinks"], [])
        self.assertIn("No affiliate links", articles[0]["contentMdx"])

    def test_publish_and_promote_records_update_only_requested_article(self) -> None:
        articles = [
            {"id": "article-one", "articleId": "article-one", "status": "test_pending"},
            {"id": "article-two", "articleId": "article-two", "status": "test_pending"},
        ]
        with patch("workers.python.writers.market_test_articles.now", return_value="2026-05-28T00:00:00+00:00"):
            published = publish_test_article_records(articles, "article-one", "noindex")
            promoted = promote_index_candidate_records(published, "article-one")

        by_id = {article["id"]: article for article in promoted}
        self.assertEqual(by_id["article-one"]["publishStatus"], "published")
        self.assertEqual(by_id["article-one"]["indexStatus"], "pending")
        self.assertEqual(by_id["article-one"]["status"], "test_published_index_candidate")
        self.assertEqual(by_id["article-two"]["status"], "test_pending")


if __name__ == "__main__":
    unittest.main()
