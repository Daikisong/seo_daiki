from __future__ import annotations

import unittest

from workers.python.intelligence import product_candidate_engine
from workers.python.intelligence.product_candidate_analysis import (
    analyze_product_candidates,
    product_candidate_analysis_record,
    selected_product_candidates,
)
from workers.python.intelligence.product_candidate_blocks import (
    build_product_analysis_block,
    product_analysis_markdown,
)
from workers.python.intelligence.product_candidate_discovery import (
    article_matches_id,
    article_search_text,
    candidate_matches_article,
    discover_product_candidates,
    route_for_article,
)
from workers.python.intelligence.product_candidate_importer import import_product_candidates
from workers.python.intelligence.product_candidate_paths import (
    PRODUCT_ANALYSIS_PATH,
    PRODUCT_CANDIDATES_PATH,
    TEST_ARTICLES_PATH,
    TREND_MONETIZATION_ROUTES_PATH,
    now,
)


class ProductCandidateEngineModulesTest(unittest.TestCase):
    def test_legacy_engine_reexports_split_helpers(self) -> None:
        self.assertIs(product_candidate_engine.analyze_product_candidates, analyze_product_candidates)
        self.assertIs(product_candidate_engine.build_product_analysis_block, build_product_analysis_block)
        self.assertIs(product_candidate_engine.discover_product_candidates, discover_product_candidates)
        self.assertIs(product_candidate_engine.import_product_candidates, import_product_candidates)
        self.assertIs(product_candidate_engine.now, now)
        self.assertEqual(product_candidate_engine.PRODUCT_ANALYSIS_PATH, PRODUCT_ANALYSIS_PATH)
        self.assertEqual(product_candidate_engine.PRODUCT_CANDIDATES_PATH, PRODUCT_CANDIDATES_PATH)
        self.assertEqual(product_candidate_engine.TEST_ARTICLES_PATH, TEST_ARTICLES_PATH)
        self.assertEqual(product_candidate_engine.TREND_MONETIZATION_ROUTES_PATH, TREND_MONETIZATION_ROUTES_PATH)

    def test_discovery_helpers_match_article_topic_and_id(self) -> None:
        article = {
            "id": "article-1",
            "market": "us",
            "title": "Magnesium sleep guide",
            "summary": "How to compare supplements.",
            "sections": [{"body": "Check dosage and claim risk."}],
        }
        candidate = {"market": "us", "title": "Magnesium supplement", "articleId": None}

        self.assertTrue(article_matches_id(article, "article-1"))
        self.assertIn("dosage", article_search_text(article))
        self.assertTrue(candidate_matches_article(candidate, article, article_search_text(article)))

    def test_discovery_route_helper_skips_informational_articles(self) -> None:
        article = {"id": "article-1", "market": "kr", "language": "ko", "slug": "economic-census-guide"}
        route = route_for_article(
            article,
            {
                "routes": [
                    {
                        "articleId": "article-1",
                        "market": "kr",
                        "language": "ko",
                        "slug": "economic-census-guide",
                        "route": "informational_explainer",
                    }
                ]
            },
        )

        self.assertEqual(route["route"], "informational_explainer")  # type: ignore[index]

    def test_discovery_route_helper_allows_review_articles(self) -> None:
        article = {"id": "article-2", "market": "us", "language": "en", "slug": "samsung-s90f-oled-deal"}
        route = route_for_article(
            article,
            {
                "routes": [
                    {
                        "articleId": "article-2",
                        "market": "us",
                        "language": "en",
                        "slug": "samsung-s90f-oled-deal",
                        "route": "review_comparison",
                    }
                ]
            },
        )

        self.assertEqual(route["route"], "review_comparison")  # type: ignore[index]

    def test_analysis_helpers_sort_and_keep_do_not_link_status(self) -> None:
        selected = selected_product_candidates(
            [
                {"id": "low", "relevanceScore": 20},
                {"id": "high", "relevanceScore": 90},
            ]
        )
        self.assertEqual(selected[0]["id"], "high")

        record = product_candidate_analysis_record(
            {"id": "article-1", "market": "us", "language": "en"},
            [{"id": "candidate-1", "title": "Magnesium", "riskScore": 20}],
        )
        self.assertEqual(record["status"], "do_not_link_yet")
        self.assertEqual(record["recommendedUseJson"]["linking"], "do_not_link_yet")

    def test_block_markdown_keeps_human_review_warning(self) -> None:
        markdown = product_analysis_markdown(
            {
                "comparisonJson": [
                    {
                        "title": "Candidate",
                        "matchReason": "Matches topic",
                        "verifyBeforeLinking": "Check policy",
                        "riskLevel": "medium",
                    }
                ]
            }
        )
        self.assertIn("Do not link yet", markdown)
        self.assertIn("| Candidate |", markdown)


if __name__ == "__main__":
    unittest.main()
