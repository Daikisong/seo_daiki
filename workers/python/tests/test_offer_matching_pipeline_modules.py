from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from workers.python.intelligence import offer_matching
from workers.python.intelligence.offer_matching_inventory import load_offer_inventory, offer_inventory_from_rows
from workers.python.intelligence.offer_matching_paths import (
    CONTENT_BRIEFS_PATH,
    DEFAULT_OFFERS_PATH,
    OFFER_MATCHES_PATH,
    PLACEMENT_CANDIDATES_PATH,
    TOPIC_SCORES_PATH,
)
from workers.python.intelligence.offer_matching_records import (
    brief_matches_article_filter,
    briefs_for_topic,
    match_record,
    offer_match_payload,
    placement_candidate_record,
    placement_limit_for_brief,
    scored_eligible_offers,
    topic_matches_filter,
)


class OfferMatchingPipelineModulesTest(unittest.TestCase):
    def test_offer_matching_facade_keeps_split_helpers_available(self) -> None:
        self.assertIs(offer_matching.load_offer_inventory, load_offer_inventory)
        self.assertIs(offer_matching.offer_inventory_from_rows, offer_inventory_from_rows)
        self.assertIs(offer_matching.offer_match_payload, offer_match_payload)
        self.assertIs(offer_matching.match_record, match_record)
        self.assertEqual(offer_matching.TOPIC_SCORES_PATH, TOPIC_SCORES_PATH)
        self.assertEqual(offer_matching.CONTENT_BRIEFS_PATH, CONTENT_BRIEFS_PATH)
        self.assertEqual(offer_matching.OFFER_MATCHES_PATH, OFFER_MATCHES_PATH)
        self.assertEqual(offer_matching.PLACEMENT_CANDIDATES_PATH, PLACEMENT_CANDIDATES_PATH)
        self.assertEqual(offer_matching.DEFAULT_OFFERS_PATH, DEFAULT_OFFERS_PATH)

    def test_offer_inventory_from_rows_normalizes_csv_rows(self) -> None:
        offers = offer_inventory_from_rows([
            {"title": "  USB C Charger ", "merchant_slug": "aliexpress", "category": "usb-c-chargers"}
        ])

        self.assertEqual(offers[0]["id"], "offer-usb-c-charger")
        self.assertEqual(offers[0]["merchantSlug"], "aliexpress")

    def test_load_offer_inventory_reads_csv_file(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "offers.csv"
            path.write_text(
                "title,merchant_slug,category,locale,evidence_level,last_checked_at\n"
                "USB C Charger,aliexpress,usb-c-chargers,en,verified_product,2026-05-28\n",
                encoding="utf-8",
            )
            offers = load_offer_inventory(path)

        self.assertEqual(offers[0]["title"], "USB C Charger")
        self.assertEqual(offers[0]["status"], "active")

    def test_filters_and_briefs_keep_existing_selection_rules(self) -> None:
        topic = {"id": "topic-1", "slug": "usb", "canonicalTopic": "usb c charger", "primaryLocale": "en"}
        brief = {"id": "brief-1", "topicId": "topic-1", "articleId": "article-1", "articleType": "trend"}

        self.assertTrue(topic_matches_filter(topic, None))
        self.assertTrue(topic_matches_filter(topic, "topic-1"))
        self.assertFalse(topic_matches_filter(topic, "topic-2"))
        self.assertTrue(brief_matches_article_filter(brief, "article-1"))
        self.assertTrue(brief_matches_article_filter(brief, "brief-1"))
        self.assertFalse(brief_matches_article_filter(brief, "missing"))
        self.assertEqual(briefs_for_topic(topic, [brief]), [brief])
        self.assertEqual(briefs_for_topic(topic, [])[0]["id"], "brief-usb-en")

    def test_records_keep_sponsored_draft_and_human_approval_gate(self) -> None:
        topic = {"id": "topic-1", "slug": "usb", "canonicalTopic": "usb c charger", "healthSensitive": False}
        brief = {"id": "brief-1", "topicId": "topic-1", "articleType": "trend", "titleCandidate": "USB C charger", "locale": "en"}
        scored_offer = {
            "offer": {"id": "offer-1", "merchantSlug": "aliexpress", "title": "USB charger"},
            "offerScore": 91,
            "scoreBreakdown": {"topicalFit": 100},
            "reason": "Commerce topic matched to AliExpress with evidence fit; placement remains draft until human approval.",
        }

        match = match_record(topic, brief, scored_offer)
        placement = placement_candidate_record(topic, brief, scored_offer, 1, None)

        self.assertEqual(match["status"], "candidate")
        self.assertEqual(placement["id"], "placement-candidate-brief-1-offer-1-1")
        self.assertEqual(placement["articleId"], "draft-article-brief-1")
        self.assertEqual(placement["rel"], "sponsored nofollow")
        self.assertFalse(placement["disclosureShown"])
        self.assertTrue(placement["humanApprovalRequired"])
        self.assertEqual(placement["status"], "draft")

    def test_offer_match_payload_sorts_and_limits_candidates(self) -> None:
        topic = {"id": "topic-1", "slug": "usb", "canonicalTopic": "usb c charger", "intent": "commercial", "healthSensitive": False}
        brief = {"id": "brief-1", "topicId": "topic-1", "articleId": "article-1", "articleType": "trend", "titleCandidate": "USB charger", "locale": "en"}
        offers = [
            {
                "id": "offer-low",
                "merchantSlug": "aliexpress",
                "title": "USB cable",
                "description": "charger cable",
                "category": "usb-c-chargers",
                "locale": "en",
                "evidenceLevel": "merchant_claim",
                "lastCheckedAt": "",
                "status": "active",
                "healthSensitive": False,
            },
            {
                "id": "offer-high",
                "merchantSlug": "aliexpress",
                "title": "USB C GaN charger",
                "description": "compact charger",
                "category": "usb-c-chargers",
                "locale": "en",
                "evidenceLevel": "verified_product",
                "lastCheckedAt": "2026-05-28",
                "status": "active",
                "healthSensitive": False,
            },
            {
                "id": "offer-ineligible",
                "merchantSlug": "iherb",
                "title": "Supplement",
                "description": "health",
                "category": "supplements",
                "status": "active",
                "healthSensitive": True,
            },
        ]

        scored = scored_eligible_offers(topic, brief, offers)
        payload = offer_match_payload([topic], [brief], offers, None, "article-1")

        self.assertEqual(placement_limit_for_brief(brief), 2)
        self.assertEqual([row["offer"]["id"] for row in scored], ["offer-high", "offer-low"])
        self.assertEqual([match["offerId"] for match in payload["matches"]], ["offer-high", "offer-low"])
        self.assertEqual(payload["placementCandidates"][0]["articleId"], "article-1")
        self.assertEqual(payload["placementCandidates"][0]["placementType"], "card")
        self.assertEqual(payload["placementCandidates"][1]["placementType"], "inline")

    def test_offer_match_payload_filters_by_topic_and_article(self) -> None:
        topic = {"id": "topic-1", "slug": "usb", "canonicalTopic": "usb c charger", "intent": "commercial", "healthSensitive": False}
        brief = {"id": "brief-1", "topicId": "topic-1", "articleId": "article-1", "articleType": "trend", "titleCandidate": "USB charger", "locale": "en"}
        offer = {
            "id": "offer-1",
            "merchantSlug": "aliexpress",
            "title": "USB charger",
            "description": "charger",
            "category": "usb-c-chargers",
            "locale": "en",
            "evidenceLevel": "verified_product",
            "lastCheckedAt": "2026-05-28",
            "status": "active",
            "healthSensitive": False,
        }

        self.assertEqual(offer_match_payload([topic], [brief], [offer], "missing", None)["matches"], [])
        self.assertEqual(offer_match_payload([topic], [brief], [offer], None, "missing")["matches"], [])
        self.assertEqual(len(offer_match_payload([topic], [brief], [offer], "topic-1", "article-1")["matches"]), 1)


if __name__ == "__main__":
    unittest.main()
