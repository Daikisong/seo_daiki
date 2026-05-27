import unittest

from workers.python.intelligence.trend_topic_rules import (
    affiliate_match_score,
    article_type_for_intent,
    canonical_topic_for,
    clean,
    cluster_key,
    health_sensitivity_for,
    infer_intent,
    localization_notes_for,
    localized_title,
    looks_health_related,
    match_reason,
    merchant_fit_for,
    outline_for,
    publishing_blockers,
    required_evidence_for,
    score,
    score_breakdown,
    signal_weight,
    title_candidate,
)


class TrendTopicRulesTest(unittest.TestCase):
    def test_clean_score_and_cluster_key_are_bounded_and_stable(self) -> None:
        self.assertEqual(clean(None), "")
        self.assertEqual(score(120), 100)
        self.assertEqual(score(-4), 0)
        self.assertEqual(score("bad"), 0)
        self.assertEqual(cluster_key({"topicRaw": "Best USB-C Charger Review 2026"}), "usb-c-charger")
        self.assertEqual(canonical_topic_for([{"topicRaw": "USB-C charger"}, {"query": "USB-C charger"}]), "USB-C charger")

    def test_intent_and_article_type_prioritize_health_guardrails(self) -> None:
        self.assertTrue(looks_health_related("magnesium sleep supplement"))
        self.assertEqual(infer_intent("best magnesium sleep supplement review"), "health")
        self.assertEqual(infer_intent("charger vs power bank comparison"), "comparison")
        self.assertEqual(infer_intent("coupon price drop charger"), "deal")
        self.assertEqual(infer_intent("fake wattage risk charger"), "problem")
        self.assertEqual(infer_intent("best usb c charger review"), "commercial")
        self.assertEqual(infer_intent("usb c charging basics"), "informational")

        self.assertEqual(article_type_for_intent("health"), "ingredient_guide")
        self.assertEqual(article_type_for_intent("commercial"), "buyer_guide")
        self.assertEqual(article_type_for_intent("informational"), "trend")

    def test_signal_and_topic_scoring_helpers(self) -> None:
        signal = {"growthScore": 90, "commercialScore": 60, "affiliateFitScore": 30}
        self.assertEqual(signal_weight(signal), 0.6)

        breakdown = score_breakdown(
            [
                {
                    "growthScore": 80,
                    "commercialScore": 70,
                    "evidenceFitScore": 60,
                    "affiliateFitScore": 50,
                    "competitionScore": 40,
                    "freshnessScore": 90,
                },
                {
                    "growthScore": 100,
                    "commercialScore": 50,
                    "evidenceFitScore": 40,
                    "affiliateFitScore": 30,
                    "competitionScore": 20,
                    "freshnessScore": 70,
                },
            ]
        )
        self.assertEqual(
            breakdown,
            {
                "growthScore": 90,
                "commercialScore": 60,
                "evidenceFitScore": 50,
                "affiliateFitScore": 40,
                "lowCompetitionScore": 70,
                "freshnessScore": 80,
            },
        )
        self.assertEqual(score_breakdown([])["growthScore"], 0)

    def test_content_brief_helpers_add_health_requirements(self) -> None:
        topic = {
            "canonicalTopic": "magnesium sleep",
            "primaryLocale": "en",
            "intent": "health",
            "healthSensitive": True,
            "score": 75,
        }
        self.assertEqual(health_sensitivity_for(topic), "high")
        self.assertEqual(title_candidate(topic, "ingredient_guide"), "Safety-first ingredient guide: magnesium sleep")
        self.assertIn("Health guardrails", [section["heading"] for section in outline_for(topic, "ingredient_guide")])
        self.assertIn("health disclaimer", required_evidence_for(topic))
        self.assertEqual(merchant_fit_for(topic), {"preferred": ["iherb"], "requiresHealthClaimGuard": True})
        self.assertEqual(localization_notes_for(topic)["translationGroupNeeded"], True)

        medium_topic = {**topic, "score": 65}
        self.assertEqual(health_sensitivity_for(medium_topic), "medium")
        self.assertEqual(health_sensitivity_for({"healthSensitive": False, "score": 95}), "none")

    def test_affiliate_match_and_localized_titles(self) -> None:
        health_topic = {"score": 94, "healthSensitive": True, "intent": "health"}
        commercial_topic = {"score": 77, "healthSensitive": False, "intent": "commercial"}
        self.assertEqual(affiliate_match_score(health_topic, "iherb"), 100)
        self.assertEqual(affiliate_match_score(commercial_topic, "aliexpress"), 85)
        self.assertEqual(affiliate_match_score({"score": 50, "healthSensitive": False, "intent": "informational"}, "aliexpress"), 40)
        self.assertIn("Health-sensitive topic", match_reason(health_topic, "iherb"))
        self.assertIn("Commerce-oriented topic", match_reason(commercial_topic, "aliexpress"))
        self.assertEqual(localized_title("USB-C guide", "es"), "Borrador localizado: USB-C guide")
        self.assertEqual(localized_title("USB-C guide", "de"), "Localized draft: USB-C guide")

    def test_publishing_blockers_enforce_offer_and_health_rules(self) -> None:
        self.assertEqual(publishing_blockers({"requiredEvidence": ["source"], "outlineJson": [{"heading": "One"}], "articleType": "trend"}, []), [])

        commercial_blockers = publishing_blockers(
            {"requiredEvidence": ["source"], "outlineJson": [{"heading": "One"}], "articleType": "buyer_guide", "healthSensitivity": "none"},
            [],
        )
        self.assertEqual(commercial_blockers, ["affiliate_offer_match_missing"])

        health_blockers = publishing_blockers(
            {
                "requiredEvidence": ["ingredient label source"],
                "outlineJson": [{"heading": "One"}],
                "articleType": "ingredient_guide",
                "healthSensitivity": "high",
                "merchantFitJson": {"requiresHealthClaimGuard": False},
            },
            [{"merchantSlug": "iherb"}],
        )
        self.assertEqual(health_blockers, ["health_disclaimer_requirement_missing", "health_claim_guard_requirement_missing"])

        missing_foundation = publishing_blockers({"articleType": "deal_watch", "healthSensitivity": "none"}, [])
        self.assertEqual(missing_foundation, ["required_evidence_missing", "outline_missing", "affiliate_offer_match_missing"])


if __name__ == "__main__":
    unittest.main()
