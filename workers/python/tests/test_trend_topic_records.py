import unittest
from pathlib import Path

from workers.python.intelligence.trend_topic_records import (
    affiliate_offer_match_records,
    content_brief_records,
    publishing_gate_records,
    topic_cluster_payload,
    topic_draft_lines,
    topic_localization_records,
    topic_score_from_breakdown,
    topic_score_payload,
    trend_import_payload,
)


class TrendTopicRecordsTest(unittest.TestCase):
    def test_trend_import_payload_normalizes_sources_and_scores(self) -> None:
        payload = trend_import_payload(
            [
                {
                    "source_slug": "manual-us",
                    "source_name": "Manual US",
                    "source_type": "manual_csv",
                    "locale": "en",
                    "country": "US",
                    "query": "best usb c charger 2026",
                    "topic_raw": "Best USB-C Charger Review 2026",
                    "volume_score": "120",
                    "growth_score": "80",
                    "competition_score": "-3",
                    "commercial_score": "75",
                    "freshness_score": "70",
                    "evidence_fit_score": "65",
                    "affiliate_fit_score": "60",
                },
                {
                    "source_slug": "manual-us",
                    "locale": "en",
                    "country": "US",
                    "query": "usb c charger price",
                    "topic_raw": "USB-C charger price",
                    "growth_score": "bad",
                },
            ],
            Path("data/seeds/trend-signals.csv"),
            "2026-05-27T00:00:00+00:00",
        )

        self.assertEqual(len(payload["sources"]), 1)
        self.assertEqual(payload["sources"][0]["id"], "trend-source-manual-us")
        self.assertEqual(payload["signals"][0]["id"], "trend-signal-manual-us-en-best-usb-c-charger-2026-1")
        self.assertEqual(payload["signals"][0]["volumeScore"], 100)
        self.assertEqual(payload["signals"][0]["competitionScore"], 0)
        self.assertEqual(payload["signals"][1]["growthScore"], 0)
        self.assertEqual(payload["signals"][1]["capturedAt"], "2026-05-27T00:00:00+00:00")

    def test_cluster_and_score_payload_keep_topic_links_stable(self) -> None:
        signals = trend_import_payload(
            [
                signal_row("best usb c charger 2026", "USB-C charger", growth=80, commercial=70, evidence=60, affiliate=50, competition=40, freshness=90),
                signal_row("usb c charger price", "USB-C charger", growth=100, commercial=50, evidence=40, affiliate=30, competition=20, freshness=70),
                signal_row("magnesium sleep supplement", "magnesium sleep", growth=90, commercial=70, evidence=80, affiliate=75, competition=45, freshness=85),
            ],
            Path("trend.csv"),
            "2026-05-27T00:00:00+00:00",
        )["signals"]

        clusters = topic_cluster_payload(signals)
        self.assertEqual([topic["slug"] for topic in clusters["topics"]], ["magnesium-sleep", "usb-c-charger"])
        usb_topic = next(topic for topic in clusters["topics"] if topic["slug"] == "usb-c-charger")
        health_topic = next(topic for topic in clusters["topics"] if topic["slug"] == "magnesium-sleep")
        self.assertEqual(usb_topic["signalCount"], 2)
        self.assertEqual(usb_topic["primaryLocale"], "en")
        self.assertEqual(health_topic["intent"], "health")
        self.assertTrue(health_topic["healthSensitive"])
        self.assertTrue(all(link["weight"] > 0 for link in clusters["topicSignals"]))

        scored = topic_score_payload(clusters, signals)
        scored_usb = next(topic for topic in scored["topics"] if topic["slug"] == "usb-c-charger")
        self.assertEqual(scored_usb["scoreBreakdown"]["growthScore"], 90)
        self.assertEqual(scored_usb["score"], topic_score_from_breakdown(scored_usb["scoreBreakdown"]))

    def test_content_offer_draft_localization_and_gate_records(self) -> None:
        topic = {
            "id": "topic-magnesium-sleep",
            "canonicalTopic": "magnesium sleep",
            "slug": "magnesium-sleep",
            "cluster": "magnesium-sleep",
            "primaryLocale": "en",
            "intent": "health",
            "healthSensitive": True,
            "status": "candidate",
            "score": 76,
            "scoreBreakdown": {},
            "signalCount": 1,
        }

        brief = content_brief_records([topic])[0]
        self.assertEqual(brief["articleType"], "ingredient_guide")
        self.assertEqual(brief["healthSensitivity"], "high")
        self.assertIn("health disclaimer", brief["requiredEvidence"])

        matches = affiliate_offer_match_records([topic])
        self.assertEqual(matches[0]["merchantSlug"], "iherb")
        self.assertGreater(matches[0]["matchScore"], topic["score"])

        lines = topic_draft_lines(brief)
        self.assertIn("- Include a visible health disclaimer.", lines)

        localized = topic_localization_records([brief], ["en", "es", "pt-br"])
        self.assertEqual([row["targetLocale"] for row in localized], ["es", "pt-br"])
        self.assertTrue(all(row["localizationNotes"]["requiresHumanReview"] for row in localized))

        self.assertEqual(publishing_gate_records([brief], matches)[0]["status"], "ready_for_human_review")
        blocked = {**brief, "requiredEvidence": ["ingredient label source"], "merchantFitJson": {"requiresHealthClaimGuard": False}}
        self.assertEqual(
            publishing_gate_records([blocked], matches)[0]["blockers"],
            ["health_disclaimer_requirement_missing", "health_claim_guard_requirement_missing"],
        )


def signal_row(
    query: str,
    topic_raw: str,
    *,
    growth: int,
    commercial: int,
    evidence: int,
    affiliate: int,
    competition: int,
    freshness: int,
) -> dict[str, str]:
    return {
        "source_slug": "manual-us",
        "locale": "en",
        "country": "US",
        "query": query,
        "topic_raw": topic_raw,
        "growth_score": str(growth),
        "commercial_score": str(commercial),
        "evidence_fit_score": str(evidence),
        "affiliate_fit_score": str(affiliate),
        "competition_score": str(competition),
        "freshness_score": str(freshness),
    }


if __name__ == "__main__":
    unittest.main()
