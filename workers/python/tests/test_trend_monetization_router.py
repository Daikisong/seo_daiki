from __future__ import annotations

import unittest

from workers.python.intelligence.trend_monetization_router import (
    INFORMATIONAL_EXPLAINER,
    REVIEW_COMPARISON,
    SOURCE_MARKET_ONLY,
    TRANSLATE_ALL_PRODUCT_MARKETS,
    route_decision,
    route_records,
)


class TrendMonetizationRouterTest(unittest.TestCase):
    def test_public_service_topic_routes_to_informational_explainer(self) -> None:
        decision = route_decision(
            {
                "title": "경제총조사 참여 전 확인할 점",
                "summary": "공식 조사 일정, 참여 방식, 확인해야 할 안내 문구를 정리합니다.",
            },
            {
                "keyword": "경제총조사",
                "dominantIntent": "informational",
                "dominantContentTypesJson": ["article", "official"],
                "recommendedArticleType": "article",
            },
        )

        self.assertEqual(decision["route"], INFORMATIONAL_EXPLAINER)
        self.assertIn("ProductCandidateDiscovery", decision["blockedNextSteps"])
        self.assertIn("MarketWideTranslationExpansion", decision["blockedNextSteps"])
        self.assertEqual(decision["localizationPolicy"]["strategy"], SOURCE_MARKET_ONLY)
        self.assertEqual(decision["localizationPolicy"]["targetRule"], "source_market_only")

    def test_oled_deal_routes_to_review_comparison(self) -> None:
        decision = route_decision(
            {
                "title": "Samsung S90F OLED deal: what US buyers should verify first",
                "summary": "Check discount, warranty, size, gaming specs, and return policy before buying.",
            },
            {
                "keyword": "samsung s90f oled deal",
                "dominantIntent": "commercial_research",
                "dominantContentTypesJson": ["review", "deal"],
                "recommendedArticleType": "buyer_intent_test_post",
            },
        )

        self.assertEqual(decision["route"], REVIEW_COMPARISON)
        self.assertIn("ProductCandidateDiscovery", decision["allowedNextSteps"])
        self.assertIn("MarketLocalizedDrafts", decision["allowedNextSteps"])
        self.assertEqual(decision["localizationPolicy"]["strategy"], TRANSLATE_ALL_PRODUCT_MARKETS)
        self.assertEqual(decision["localizationPolicy"]["targetRule"], "all_enabled_markets")
        self.assertTrue(decision["localizationPolicy"]["requiresMarketAdaptation"])
        self.assertFalse(decision["localizationPolicy"]["translationOnlyIndexable"])
        self.assertIn(
            "local price, availability, warranty, retailer, and return-policy context",
            decision["localizationPolicy"]["requiredLocalSignals"],
        )

    def test_health_product_topic_routes_to_review_with_guard(self) -> None:
        decision = route_decision(
            {
                "title": "Magnesium sleep supplement comparison",
                "summary": "Compare magnesium supplement forms and what claims need evidence.",
            },
            {
                "keyword": "magnesium sleep supplement",
                "dominantIntent": "commercial_research",
                "dominantContentTypesJson": ["review", "comparison"],
                "recommendedArticleType": "buyer_intent_test_post",
            },
        )

        self.assertEqual(decision["route"], REVIEW_COMPARISON)
        self.assertIn("health_claim_guard", decision["requiredGuards"])

    def test_tax_official_topic_routes_to_informational_explainer(self) -> None:
        decision = route_decision(
            {
                "title": "Renta 2025 y AEAT: qué comprobar antes de corregir una declaración",
                "summary": "Guía para entender avisos oficiales y revisar errores comunes.",
            },
            {
                "keyword": "renta 2025 avisos aeat",
                "dominantIntent": "informational",
                "dominantContentTypesJson": ["official", "guide"],
                "recommendedArticleType": "official",
            },
        )

        self.assertEqual(decision["route"], INFORMATIONAL_EXPLAINER)

    def test_records_match_article_to_existing_serp_opportunity(self) -> None:
        records = route_records(
            [
                {
                    "id": "article-1",
                    "market": "us",
                    "language": "en",
                    "slug": "samsung-s90f-oled-deal",
                    "title": "Samsung S90F OLED deal",
                    "summary": "Compare price and warranty.",
                }
            ],
            [
                {
                    "keywordId": "keyword-1",
                    "market": "us",
                    "language": "en",
                    "keyword": "samsung s90f oled deal",
                    "dominantIntent": "commercial_research",
                    "dominantContentTypesJson": ["review", "deal"],
                    "recommendedArticleType": "buyer_intent_test_post",
                }
            ],
        )

        self.assertEqual(records[0]["keywordId"], "keyword-1")
        self.assertEqual(records[0]["route"], REVIEW_COMPARISON)

    def test_records_default_to_current_serp_opportunities_not_stale_articles(self) -> None:
        records = route_records(
            [
                {
                    "id": "old-article",
                    "market": "kr",
                    "language": "ko",
                    "slug": "old-topic",
                    "title": "Old topic",
                }
            ],
            [
                {
                    "keywordId": "new-keyword",
                    "market": "us",
                    "language": "en",
                    "keyword": "samsung s90f oled deal",
                    "dominantIntent": "commercial_research",
                    "dominantContentTypesJson": ["review", "deal"],
                    "recommendedArticleType": "buyer_intent_test_post",
                }
            ],
        )

        self.assertEqual(len(records), 1)
        self.assertEqual(records[0]["market"], "us")
        self.assertEqual(records[0]["keywordId"], "new-keyword")
        self.assertEqual(records[0]["route"], REVIEW_COMPARISON)


if __name__ == "__main__":
    unittest.main()
