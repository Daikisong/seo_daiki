from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from workers.python.validators.quality_gate_io import load_evidence_packs, load_url_inventory, read_draft
from workers.python.validators.quality_gate_pack import validate_hallucinations
from workers.python.validators.quality_gate_report import build_quality_gate_output, quality_gate_status, split_issues_by_severity


class QualityGateModulesTest(unittest.TestCase):
    def test_report_status_counts_global_and_pack_issues(self) -> None:
        output = build_quality_gate_output(
            packs=[{"product_id": "p1"}],
            inventory=[{"url": "/en/reviews/a"}],
            global_issues=[{"severity": "blocker", "code": "hreflang_missing"}],
            evidence_results=[{"issues": [{"severity": "warning", "code": "thin"}]}],
            generated_at="2026-05-28T00:00:00+00:00",
        )

        self.assertEqual(output["status"], "blocked")
        self.assertEqual(output["generated_at"], "2026-05-28T00:00:00+00:00")
        self.assertEqual(output["summary"]["evidence_packs"], 1)  # type: ignore[index]
        self.assertEqual(output["summary"]["inventory_urls"], 1)  # type: ignore[index]
        self.assertEqual(output["summary"]["blockers"], 1)  # type: ignore[index]
        self.assertEqual(output["summary"]["warnings"], 1)  # type: ignore[index]

    def test_status_helper_prefers_blockers_over_warnings(self) -> None:
        blockers, warnings = split_issues_by_severity(
            [{"severity": "warning"}, {"severity": "blocker"}, {"severity": "info"}]
        )

        self.assertEqual(len(blockers), 1)
        self.assertEqual(len(warnings), 1)
        self.assertEqual(quality_gate_status(blockers, warnings), "blocked")
        self.assertEqual(quality_gate_status([], warnings), "pass_with_warnings")
        self.assertEqual(quality_gate_status([], []), "pass")

    def test_hallucination_validator_uses_forbidden_claims(self) -> None:
        issues = validate_hallucinations(
            {"forbidden_claims": ["do not cure insomnia"]},
            "This draft says the product can cure insomnia.",
        )

        self.assertEqual(len(issues), 1)
        self.assertEqual(issues[0]["code"], "forbidden_claim_in_draft")

    def test_io_helpers_read_packs_inventory_and_drafts(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "evidence_packs").mkdir()
            (root / "exports").mkdir()
            (root / "drafts").mkdir()
            (root / "evidence_packs" / "packs.json").write_text(
                '[{"product_id": "p1", "locale": "en"}, "ignored"]',
                encoding="utf-8",
            )
            (root / "exports" / "initial_url_inventory.json").write_text('[{"url": "/en/a"}]', encoding="utf-8")
            (root / "drafts" / "en-a.md").write_text("A", encoding="utf-8")
            (root / "drafts" / "en-b.md").write_text("B", encoding="utf-8")

            packs = load_evidence_packs(root)

            self.assertEqual(len(packs), 1)
            self.assertEqual(packs[0]["_source_file"], "evidence_packs/packs.json")
            self.assertEqual(load_url_inventory(root), [{"url": "/en/a"}])
            self.assertEqual(read_draft("en", root), "A\n\nB")


if __name__ == "__main__":
    unittest.main()
