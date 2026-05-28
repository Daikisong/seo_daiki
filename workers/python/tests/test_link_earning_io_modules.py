from __future__ import annotations

import unittest

from workers.python.outreach import link_earning
from workers.python.outreach.link_earning_io import (
    assets_by_id,
    linkable_assets_payload,
    outreach_send_enabled,
    prospects_by_id,
    smtp_adapter_ready,
)


class LinkEarningIOModuleTests(unittest.TestCase):
    def test_link_earning_orchestrator_keeps_io_helpers_available(self) -> None:
        self.assertIs(link_earning.assets_by_id, assets_by_id)
        self.assertIs(link_earning.prospects_by_id, prospects_by_id)
        self.assertIs(link_earning.linkable_assets_payload, linkable_assets_payload)
        self.assertIs(link_earning.outreach_send_enabled, outreach_send_enabled)
        self.assertIs(link_earning.smtp_adapter_ready, smtp_adapter_ready)

    def test_assets_and_prospects_maps_skip_bad_rows(self) -> None:
        assets = assets_by_id([{"id": "asset-1", "url": "/en/data/usb"}, "bad-row", {"url": "/missing-id"}])
        prospects = prospects_by_id([{"id": "prospect-1", "domain": "publisher.test"}, "bad-row"])

        self.assertEqual(assets["asset-1"]["url"], "/en/data/usb")
        self.assertNotIn(None, assets)
        self.assertEqual(prospects, {"prospect-1": {"id": "prospect-1", "domain": "publisher.test"}})

    def test_linkable_assets_payload_caps_output(self) -> None:
        assets = [{"id": f"asset-{index}"} for index in range(105)]
        payload = linkable_assets_payload(assets)

        self.assertEqual(len(payload["assets"]), 100)
        self.assertEqual(payload["assets"][0]["id"], "asset-0")
        self.assertEqual(payload["assets"][-1]["id"], "asset-99")

    def test_outreach_send_environment_stays_disabled_without_explicit_config(self) -> None:
        self.assertFalse(outreach_send_enabled({}))
        self.assertFalse(outreach_send_enabled({"ENABLE_OUTREACH_SEND": "false"}))
        self.assertTrue(outreach_send_enabled({"ENABLE_OUTREACH_SEND": "true"}))
        self.assertFalse(smtp_adapter_ready({"SMTP_HOST": "smtp.test"}))
        self.assertTrue(smtp_adapter_ready({"SMTP_HOST": "smtp.test", "OUTREACH_SENDER_EMAIL": "sender@test"}))


if __name__ == "__main__":
    unittest.main()
