from __future__ import annotations

import unittest

from workers.python.writers import market_test_articles
from workers.python.writers.market_test_article_records import (
    strategy_matches_filter,
    test_article_record,
    test_article_records_for_strategies,
)
from workers.python.writers.market_test_article_state import (
    article_matches_id,
    article_status_for_index_status,
    promote_index_candidate_record,
    promote_index_candidate_rows,
    publish_test_article_record,
    publish_test_article_rows,
    published_state_for_mode,
    set_article_index_status_record,
    set_article_index_status_rows,
)


class MarketTestArticleModuleTests(unittest.TestCase):
    def test_market_test_article_facade_keeps_split_helpers_available(self) -> None:
        self.assertIs(market_test_articles.strategy_matches_filter, strategy_matches_filter)
        self.assertIs(market_test_articles.test_article_record, test_article_record)
        self.assertIs(market_test_articles.test_article_records_for_strategies, test_article_records_for_strategies)
        self.assertIs(market_test_articles.article_matches_id, article_matches_id)
        self.assertIs(market_test_articles.publish_test_article_record, publish_test_article_record)
        self.assertIs(market_test_articles.promote_index_candidate_record, promote_index_candidate_record)
        self.assertIs(market_test_articles.set_article_index_status_record, set_article_index_status_record)

    def test_test_article_record_keeps_test_post_safety_defaults(self) -> None:
        strategy = {
            "id": "content-strategy-kw-us-usb",
            "market": "us",
            "language": "en",
            "slug": "usb-c-charger",
            "titleStrategy": "USB C Charger",
            "recommendedAngle": "Compare charger specs before choosing.",
            "sectionPlanJson": [{"heading": "Direct answer", "purpose": "Answer first."}],
            "monetizationRoute": "review_comparison",
            "marketExpansionPolicy": "translate_all_product_markets",
            "localizationPolicyJson": {"targetRule": "all_enabled_markets"},
        }

        article = test_article_record(strategy, lambda: "2026-05-28T00:00:00+00:00")

        self.assertEqual(article["id"], "test-article-content-strategy-kw-us-usb")
        self.assertEqual(article["indexStatus"], "noindex")
        self.assertEqual(article["publishStatus"], "pending")
        self.assertEqual(article["affiliateLinks"], [])
        self.assertEqual(article["contentBranch"], "review")
        self.assertTrue(article["monetizationDeferred"])
        self.assertEqual(article["productCandidateState"], "allowed_pending")
        self.assertEqual(article["marketExpansionPolicy"], "translate_all_product_markets")
        self.assertEqual(article["localizationPolicyJson"]["targetRule"], "all_enabled_markets")
        self.assertIn("## Quick Answer", article["contentMdx"])
        self.assertEqual(article["createdAt"], article["updatedAt"])

    def test_test_article_records_filter_strategies_and_skip_bad_rows(self) -> None:
        strategies = [
            {"id": "strategy-one", "titleStrategy": "One"},
            {"id": "strategy-two", "titleStrategy": "Two"},
            "bad-row",
        ]
        records = test_article_records_for_strategies(strategies, "strategy-two", lambda: "now")

        self.assertTrue(strategy_matches_filter({"id": "strategy-two"}, "strategy-two"))
        self.assertFalse(strategy_matches_filter({"id": "strategy-one"}, "strategy-two"))
        self.assertEqual([record["strategyId"] for record in records], ["strategy-two"])

    def test_publish_state_rules_keep_noindex_default_and_candidate_mode(self) -> None:
        article = {"id": "article-one", "articleId": "external-one", "status": "test_pending"}

        noindex = publish_test_article_record(article, "article-one", "noindex", lambda: "published-at")
        candidate = publish_test_article_record(article, "external-one", "candidate", lambda: "published-at")

        self.assertTrue(article_matches_id(article, "external-one"))
        self.assertEqual(published_state_for_mode("noindex"), ("noindex", "test_published_noindex"))
        self.assertEqual(noindex["publishStatus"], "published")
        self.assertEqual(noindex["indexStatus"], "noindex")
        self.assertEqual(noindex["status"], "test_published_noindex")
        self.assertEqual(candidate["indexStatus"], "pending")
        self.assertEqual(candidate["status"], "test_published_index_candidate")

    def test_row_state_helpers_skip_bad_rows_and_promote_only_matching_article(self) -> None:
        articles = [
            {"id": "article-one", "articleId": "article-one", "status": "test_pending"},
            {"id": "article-two", "articleId": "article-two", "status": "test_pending"},
            "bad-row",
        ]

        published = publish_test_article_rows(articles, "article-one", "noindex", lambda: "published-at")
        promoted = promote_index_candidate_rows(published, "article-one", lambda: "promoted-at")

        self.assertEqual(len(promoted), 2)
        by_id = {article["id"]: article for article in promoted}
        self.assertEqual(by_id["article-one"]["status"], "test_published_index_candidate")
        self.assertEqual(by_id["article-one"]["updatedAt"], "promoted-at")
        self.assertEqual(by_id["article-two"]["status"], "test_pending")
        self.assertEqual(
            promote_index_candidate_record({"id": "article-two", "status": "test_pending"}, "missing", lambda: "now")["status"],
            "test_pending",
        )

    def test_index_status_switch_can_open_or_close_indexing_after_approval(self) -> None:
        articles = [
            {"id": "article-one", "articleId": "article-one", "status": "test_published_noindex", "indexStatus": "noindex"},
            {"id": "article-two", "articleId": "article-two", "status": "test_pending", "indexStatus": "noindex"},
            "bad-row",
        ]

        indexed = set_article_index_status_rows(articles, "article-one", "index", lambda: "indexed-at")
        by_id = {article["id"]: article for article in indexed}

        self.assertEqual(article_status_for_index_status("index"), "test_published_index")
        self.assertEqual(article_status_for_index_status("noindex"), "test_published_noindex")
        self.assertEqual(article_status_for_index_status("pending"), "test_published_index_candidate")
        self.assertEqual(by_id["article-one"]["indexStatus"], "index")
        self.assertEqual(by_id["article-one"]["publishStatus"], "published")
        self.assertEqual(by_id["article-one"]["status"], "test_published_index")
        self.assertEqual(by_id["article-one"]["updatedAt"], "indexed-at")
        self.assertEqual(by_id["article-two"]["indexStatus"], "noindex")

        noindex = set_article_index_status_record(by_id["article-one"], "article-one", "noindex", lambda: "closed-at")
        self.assertEqual(noindex["indexStatus"], "noindex")
        self.assertEqual(noindex["status"], "test_published_noindex")


if __name__ == "__main__":
    unittest.main()
