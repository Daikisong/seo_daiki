from __future__ import annotations

import unittest

from workers.python.cli_dispatch import run_command
from workers.python.cli_parser import build_parser


class CliParserTests(unittest.TestCase):
    def test_trend_import_defaults_to_seed_file(self) -> None:
        args = build_parser().parse_args(["trend:import-signals"])

        self.assertEqual(args.command, "trend:import-signals")
        self.assertTrue(args.file.endswith("data/seeds/trend-signals.csv"))

    def test_pipeline_trend_to_post_parses_continue_flag(self) -> None:
        args = build_parser().parse_args(["pipeline:trend-to-post", "--continue-on-error"])

        self.assertEqual(args.command, "pipeline:trend-to-post")
        self.assertTrue(args.continue_on_error)
        self.assertTrue(args.trend_signal_file.endswith("data/seeds/trend-signals.csv"))
        self.assertTrue(args.serp_results_file.endswith("data/seeds/serp-results.csv"))

    def test_api_free_six_pipeline_parser(self) -> None:
        args = build_parser().parse_args(["pipeline:api-free-six", "--continue-on-error"])

        self.assertEqual(args.command, "pipeline:api-free-six")
        self.assertTrue(args.continue_on_error)
        self.assertTrue(args.trend_signal_file.endswith("data/seeds/trend-signals.csv"))
        self.assertTrue(args.serp_results_file.endswith("data/seeds/serp-results.csv"))

    def test_api_free_six_verify_parser(self) -> None:
        args = build_parser().parse_args(["verify:api-free-six"])

        self.assertEqual(args.command, "verify:api-free-six")

    def test_disabled_offer_matching_returns_guidance(self) -> None:
        args = build_parser().parse_args(["match-affiliate-offers"])

        self.assertEqual(
            run_command(args),
            "match-affiliate-offers is disabled by ENABLE_OFFER_MATCHING=false; use product candidate analysis first.",
        )

    def test_disabled_distribution_returns_guidance(self) -> None:
        args = build_parser().parse_args(["generate-distribution-assets", "--article-id", "article-1"])

        self.assertEqual(
            run_command(args),
            "generate-distribution-assets is disabled by ENABLE_DISTRIBUTION_DRAFTS=false.",
        )

    def test_disabled_outreach_returns_guidance(self) -> None:
        args = build_parser().parse_args(["draft-outreach"])

        self.assertEqual(
            run_command(args),
            "draft-outreach is disabled by ENABLE_LINK_EARNING=false.",
        )


if __name__ == "__main__":
    unittest.main()
