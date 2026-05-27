from __future__ import annotations

import unittest

from workers.python.outreach.link_earning_assets import build_linkable_assets
from workers.python.outreach.link_earning_messages import (
    approve_outreach_messages,
    build_outreach_send_report,
    draft_outreach_messages,
)
from workers.python.outreach.link_earning_prospects import build_imported_prospects, score_link_prospect_rows


class LinkEarningModulesTest(unittest.TestCase):
    def test_linkable_asset_builder_filters_and_sorts_inventory(self) -> None:
        assets = build_linkable_assets(
            [
                {"path": "/en/data/usb/", "type": "data", "cluster": "usb charger", "slug": "usb-charger-data"},
                {"path": "/en/trends/usb/", "type": "trend", "cluster": "usb charger", "slug": "usb"},
                {"path": "/en/guides/gan/", "type": "guide", "cluster": "gan charger", "slug": "gan-charger-real-tests"},
            ]
        )

        self.assertEqual([asset["assetType"] for asset in assets], ["data", "guide"])
        self.assertEqual(assets[0]["id"], "linkable-en-data-usb")
        self.assertGreater(assets[0]["linkableScore"], assets[1]["linkableScore"])

    def test_prospect_import_and_scoring_respect_suppression(self) -> None:
        suppression = [{"email": "", "domain": "blocked.test", "reason": "domain opt-out"}]
        prospects = build_imported_prospects(
            [
                {"page_url": "https://publisher.test/usb", "topic": "usb charger", "contact_email": "editor@publisher.test"},
                {"page_url": "https://blocked.test/usb", "topic": "usb charger"},
            ],
            suppression,
        )
        assets = [{"id": "asset-1", "topic": "usb charger", "linkableScore": 80, "assetType": "data"}]
        scored = score_link_prospect_rows(prospects, assets, suppression)

        self.assertEqual(scored[0]["status"], "qualified")
        self.assertEqual(scored[0]["suggestedAssetId"], "asset-1")
        self.assertEqual(scored[1]["status"], "suppressed")
        self.assertEqual(scored[1]["prospectScore"], 0)

    def test_draft_approval_and_send_report_stay_human_gated(self) -> None:
        prospects = [
            {
                "id": "prospect-1",
                "domain": "publisher.test",
                "topic": "usb charger",
                "status": "qualified",
                "suggestedAssetId": "asset-1",
                "contactEmail": "editor@publisher.test",
            }
        ]
        assets = {"asset-1": {"id": "asset-1", "url": "/en/data/usb/", "topic": "usb charger", "assetType": "data"}}
        messages = draft_outreach_messages(prospects, assets, [], [], lambda: "2026-05-28T00:00:00Z")

        self.assertEqual(len(messages), 1)
        self.assertEqual(messages[0]["status"], "draft")
        self.assertEqual(messages[0]["approvedByHuman"], False)

        approved = approve_outreach_messages(
            messages,
            {"prospect-1": prospects[0]},
            [],
            messages[0]["id"],
            lambda: "2026-05-28T00:01:00Z",
        )
        self.assertEqual(approved[0]["status"], "approved")
        report = build_outreach_send_report(approved, {"prospect-1": prospects[0]}, [], False, False, lambda: "now")

        self.assertEqual(report["sent"], 0)
        self.assertEqual(report["results"][0]["status"], "skipped_disabled")


if __name__ == "__main__":
    unittest.main()
