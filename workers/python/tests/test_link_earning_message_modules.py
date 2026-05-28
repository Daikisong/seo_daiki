from __future__ import annotations

import unittest

from workers.python.outreach import link_earning_messages
from workers.python.outreach.link_earning_message_approval import (
    approve_message_record,
    approve_outreach_messages,
    message_prospect,
    message_recipient_email,
    suppress_message,
)
from workers.python.outreach.link_earning_message_drafts import (
    draft_outreach_messages,
    outreach_message_id,
    outreach_message_record,
    prospect_can_receive_outreach,
)
from workers.python.outreach.link_earning_send_report import (
    build_outreach_send_report,
    outreach_message_is_send_candidate,
    send_decision,
    send_result,
)


class LinkEarningMessageModulesTest(unittest.TestCase):
    def test_message_facade_keeps_public_exports(self) -> None:
        self.assertIs(link_earning_messages.draft_outreach_messages, draft_outreach_messages)
        self.assertIs(link_earning_messages.approve_outreach_messages, approve_outreach_messages)
        self.assertIs(link_earning_messages.build_outreach_send_report, build_outreach_send_report)
        self.assertIs(link_earning_messages.send_decision, send_decision)

    def test_draft_helpers_require_qualified_contactable_unsuppressed_prospect(self) -> None:
        suppression = [{"domain": "blocked.test", "email": "", "reason": "domain opt-out"}]
        qualified = {"id": "prospect-1", "status": "qualified", "domain": "publisher.test", "contactEmail": "editor@publisher.test"}
        blocked = {"id": "prospect-2", "status": "qualified", "domain": "blocked.test", "contactEmail": "editor@blocked.test"}
        no_contact = {"id": "prospect-3", "status": "qualified", "domain": "publisher.test"}

        self.assertTrue(prospect_can_receive_outreach(qualified, suppression))
        self.assertFalse(prospect_can_receive_outreach(blocked, suppression))
        self.assertFalse(prospect_can_receive_outreach(no_contact, suppression))

    def test_draft_message_record_uses_stable_ids_and_human_gate(self) -> None:
        prospect = {"id": "prospect 1", "topic": "usb charger", "contactEmail": "editor@publisher.test"}
        asset = {"id": "asset 1", "topic": "usb charger", "url": "/en/data/usb/", "assetType": "data"}

        self.assertEqual(outreach_message_id(prospect, asset), "outreach-prospect-1-asset-1")
        message = outreach_message_record(prospect, asset, lambda: "2026-05-28T00:00:00+00:00")

        self.assertEqual(message["id"], "outreach-prospect-1-asset-1")
        self.assertEqual(message["status"], "draft")
        self.assertFalse(message["approvedByHuman"])
        self.assertIn("Possible source", message["subject"])

    def test_draft_outreach_messages_preserves_existing_and_overwrites_same_id(self) -> None:
        prospect = {
            "id": "prospect-1",
            "status": "qualified",
            "topic": "usb charger",
            "suggestedAssetId": "asset-1",
            "contactFormUrl": "https://publisher.test/contact",
        }
        asset = {"id": "asset-1", "topic": "usb charger", "url": "/en/data/usb/", "assetType": "data"}
        existing = [{"id": "manual-message", "status": "draft"}]

        messages = draft_outreach_messages([prospect], {"asset-1": asset}, existing, [], lambda: "now")

        self.assertEqual({message["id"] for message in messages}, {"manual-message", "outreach-prospect-1-asset-1"})
        drafted = next(message for message in messages if message["id"] == "outreach-prospect-1-asset-1")
        self.assertEqual(drafted["contactFormUrl"], "https://publisher.test/contact")

    def test_approval_helpers_mutate_message_and_block_suppressed_prospect(self) -> None:
        message = {"id": "message-1", "prospectId": "prospect-1", "recipientEmail": ""}
        prospect = {"id": "prospect-1", "domain": "blocked.test", "contactEmail": "editor@blocked.test"}
        suppression = [{"domain": "blocked.test", "email": "", "reason": "domain opt-out"}]

        self.assertEqual(message_prospect(message, {"prospect-1": prospect}), prospect)
        self.assertEqual(message_recipient_email(message, prospect), "editor@blocked.test")
        with self.assertRaisesRegex(ValueError, "suppressed"):
            approve_outreach_messages([message], {"prospect-1": prospect}, suppression, "message-1", lambda: "now")
        self.assertEqual(message["status"], "suppressed")
        self.assertFalse(message["approvedByHuman"])
        self.assertEqual(message["suppressionReason"], "domain opt-out")

    def test_approval_helpers_mark_human_approval_for_allowed_message(self) -> None:
        message = {"id": "message-1", "prospectId": "prospect-1", "recipientEmail": "editor@publisher.test"}
        approve_message_record(message, lambda: "approved-at")

        self.assertEqual(message["status"], "approved")
        self.assertTrue(message["approvedByHuman"])
        self.assertEqual(message["approvedAt"], "approved-at")

        suppress_message(message, {"domain": "blocked.test"}, "editor@blocked.test", [{"domain": "blocked.test", "email": "", "reason": "opt-out"}])
        self.assertEqual(message["status"], "suppressed")

    def test_send_report_keeps_smtp_adapter_disabled_and_sends_zero(self) -> None:
        message = {"id": "message-1", "status": "approved", "approvedByHuman": True, "prospectId": "prospect-1"}
        prospect = {"id": "prospect-1", "domain": "publisher.test", "contactEmail": "editor@publisher.test"}

        self.assertTrue(outreach_message_is_send_candidate(message))
        self.assertFalse(outreach_message_is_send_candidate({"status": "draft", "approvedByHuman": False}))
        self.assertEqual(send_decision(message, prospect, [], False, False)[0], "skipped_disabled")
        self.assertEqual(send_decision(message, prospect, [], True, False)[0], "blocked_missing_smtp")
        self.assertEqual(send_decision(message, prospect, [], True, True)[0], "blocked_not_implemented")

        report = build_outreach_send_report([message], {"prospect-1": prospect}, [], True, True, lambda: "captured")
        self.assertEqual(report["sent"], 0)
        self.assertEqual(report["results"][0]["status"], "blocked_not_implemented")
        self.assertEqual(send_result(message, "status", "detail", lambda: "now")["capturedAt"], "now")


if __name__ == "__main__":
    unittest.main()
