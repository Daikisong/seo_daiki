from __future__ import annotations

import unittest
from pathlib import Path

from workers.python import pipeline_steps
from workers.python.pipeline_monetization_steps import monetization_review_steps as direct_monetization_review_steps
from workers.python.pipeline_product_steps import post_to_product_analysis_steps as direct_post_to_product_analysis_steps
from workers.python.pipeline_steps import (
    api_free_six_steps,
    monetization_review_steps,
    post_to_product_analysis_steps,
    trend_to_post_extra,
    trend_to_post_steps,
)
from workers.python.pipeline_trend_steps import trend_to_post_steps as direct_trend_to_post_steps


class PipelineStepsTest(unittest.TestCase):
    def test_trend_to_post_steps_stop_before_monetization(self) -> None:
        names = [name for name, _action in trend_to_post_steps(Path("trend.csv"), Path("serp.csv"))]

        self.assertIn("trend:import-signals", names)
        self.assertIn("serp:summarize-opportunity", names)
        self.assertIn("trend:route-monetization", names)
        self.assertIn("post:generate-test", names)
        self.assertNotIn("products:discover-candidates", names)
        self.assertNotIn("monetization:create-review", names)

    def test_trend_to_post_metadata_marks_later_phases_disabled(self) -> None:
        extra = trend_to_post_extra()

        self.assertEqual(extra["defaultPipelineRunsMonetization"], False)
        self.assertEqual(extra["disabledLaterPhases"]["offerMatching"], True)  # type: ignore[index]

    def test_product_and_monetization_pipelines_are_separate(self) -> None:
        product_names = [name for name, _action in post_to_product_analysis_steps(Path("products.csv"), "article-1")]
        monetization_names = [name for name, _action in monetization_review_steps("article-1")]

        self.assertEqual(product_names[0], "trend:route-monetization")
        self.assertEqual(product_names[-1], "products:build-analysis-block")
        self.assertEqual(monetization_names, ["monetization:create-review", "monetization:draft-placements"])

    def test_legacy_pipeline_steps_module_reexports_split_steps(self) -> None:
        self.assertIs(pipeline_steps.trend_to_post_steps, direct_trend_to_post_steps)
        self.assertIs(pipeline_steps.post_to_product_analysis_steps, direct_post_to_product_analysis_steps)
        self.assertIs(pipeline_steps.monetization_review_steps, direct_monetization_review_steps)

    def test_api_free_six_steps_are_exact_first_six_flow(self) -> None:
        names = [name for name, _action in api_free_six_steps(Path("trend.csv"), Path("serp.csv"))]

        self.assertEqual(
            names,
            [
                "trend:init-markets",
                "trend:import-signals",
                "trend:normalize",
                "trend:cluster",
                "trend:score",
                "trend:generate-keywords",
                "trend:report",
                "serp:import-results",
                "serp:fetch-pages",
                "serp:analyze-pages",
                "serp:summarize-opportunity",
                "serp:report",
                "trend:route-monetization",
                "strategy:create",
                "strategy:generate-brief",
                "post:generate-test",
                "post:publish-test --mode noindex",
            ],
        )
        self.assertNotIn("products:discover-candidates", names)
        self.assertNotIn("monetization:create-review", names)


if __name__ == "__main__":
    unittest.main()
