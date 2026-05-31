from __future__ import annotations

import unittest

from workers.python import cli_parser
from workers.python.cli_calendar_parsers import add_calendar_commands
from workers.python.cli_content_parsers import add_content_commands
from workers.python.cli_later_phase_parsers import add_later_phase_commands
from workers.python.cli_monetization_parsers import add_monetization_commands
from workers.python.cli_parser_helpers import add_noarg
from workers.python.cli_performance_parsers import add_performance_commands
from workers.python.cli_pipeline_parsers import add_legacy_pipeline_commands, add_pipeline_commands
from workers.python.cli_product_parsers import add_product_commands
from workers.python.cli_serp_parsers import add_serp_commands
from workers.python.cli_trend_parsers import add_legacy_trend_commands, add_trend_commands


class CliParserModuleTests(unittest.TestCase):
    def test_parser_facade_keeps_registrars_available(self) -> None:
        self.assertIs(cli_parser.add_noarg, add_noarg)
        self.assertEqual(
            cli_parser.PARSER_REGISTRARS,
            (
                add_trend_commands,
                add_serp_commands,
                add_content_commands,
                add_calendar_commands,
                add_performance_commands,
                add_product_commands,
                add_monetization_commands,
                add_pipeline_commands,
                add_legacy_trend_commands,
                add_legacy_pipeline_commands,
                add_later_phase_commands,
            ),
        )

    def test_trend_and_serp_commands_keep_defaults(self) -> None:
        parser = cli_parser.build_parser()
        trend = parser.parse_args(["trend:collect", "--market", "us"])
        serp = parser.parse_args(["serp:collect", "--keyword-id", "keyword-1"])

        self.assertEqual(trend.command, "trend:collect")
        self.assertEqual(trend.market, "us")
        self.assertEqual(trend.source, "manual_csv")
        self.assertEqual(serp.command, "serp:collect")
        self.assertEqual(serp.keyword_id, "keyword-1")
        self.assertEqual(serp.provider, "manual_csv")

    def test_content_and_calendar_commands_parse_arguments(self) -> None:
        parser = cli_parser.build_parser()
        post = parser.parse_args(["post:publish-test", "--article-id", "article-1"])
        index_status = parser.parse_args(["post:set-index-status", "--article-id", "article-1", "--index-status", "index"])
        calendar = parser.parse_args(["calendar:explain", "--market", "kr"])

        self.assertEqual(post.command, "post:publish-test")
        self.assertEqual(post.article_id, "article-1")
        self.assertEqual(post.mode, "noindex")
        self.assertEqual(index_status.command, "post:set-index-status")
        self.assertEqual(index_status.article_id, "article-1")
        self.assertEqual(index_status.index_status, "index")
        self.assertEqual(calendar.command, "calendar:explain")
        self.assertEqual(calendar.market, "kr")

    def test_performance_product_and_monetization_commands_parse_arguments(self) -> None:
        parser = cli_parser.build_parser()
        performance = parser.parse_args(["performance:report", "--market", "br"])
        product = parser.parse_args(["products:import-candidates"])
        monetization = parser.parse_args(["monetization:draft-placements", "--review-id", "review-1"])

        self.assertEqual(performance.market, "br")
        self.assertTrue(product.file.endswith("data/seeds/product-candidates.csv"))
        self.assertEqual(monetization.command, "monetization:draft-placements")
        self.assertEqual(monetization.review_id, "review-1")

    def test_pipeline_legacy_and_later_phase_commands_keep_defaults(self) -> None:
        parser = cli_parser.build_parser()
        pipeline = parser.parse_args(["pipeline:post-to-product-analysis", "--continue-on-error"])
        legacy = parser.parse_args(["run-pipeline"])
        offer = parser.parse_args(["match-affiliate-offers", "--topic-id", "topic-1"])

        self.assertTrue(pipeline.continue_on_error)
        self.assertTrue(pipeline.candidates_file.endswith("data/seeds/product-candidates.csv"))
        self.assertTrue(legacy.trend_signal_file.endswith("data/seeds/trend-signals.csv"))
        self.assertEqual(offer.topic_id, "topic-1")
        self.assertIsNone(offer.article_id)
        self.assertTrue(offer.offers_file.endswith("data/seeds/offers.csv"))


if __name__ == "__main__":
    unittest.main()
