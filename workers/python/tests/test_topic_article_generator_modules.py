from __future__ import annotations

import unittest

from workers.python.writers import topic_article_generator
from workers.python.writers.topic_article_inputs import filter_briefs, placements_for_brief
from workers.python.writers.topic_article_markdown import markdown_article_lines
from workers.python.writers.topic_article_model import (
    build_topic_article,
    computed_quality_score,
    health_sensitivity_for_brief,
    topic_article_prompt,
)


class TopicArticleGeneratorModulesTest(unittest.TestCase):
    def test_legacy_generator_module_reexports_split_helpers(self) -> None:
        self.assertIs(topic_article_generator.topic_article_prompt, topic_article_prompt)
        self.assertIs(topic_article_generator.computed_quality_score, computed_quality_score)

    def test_filters_briefs_by_optional_fields(self) -> None:
        briefs = [
            {"id": "b1", "topicId": "t1", "locale": "en"},
            {"id": "b2", "topicId": "t2", "locale": "es"},
        ]

        self.assertEqual(filter_briefs(briefs, topic_id="t1"), [briefs[0]])
        self.assertEqual(filter_briefs(briefs, brief_id="b2", locale="es"), [briefs[1]])
        self.assertEqual(filter_briefs(briefs, locale="ko"), [])

    def test_matches_placements_by_brief_id(self) -> None:
        brief = {"id": "brief-1"}
        placements = [
            {"briefId": "brief-1", "anchorText": "A"},
            {"briefId": "brief-2", "anchorText": "B"},
        ]

        self.assertEqual(placements_for_brief(placements, brief), [placements[0]])

    def test_build_topic_article_keeps_guarded_defaults(self) -> None:
        article = build_topic_article(
            {
                "id": "Brief 1",
                "topicId": "topic-1",
                "locale": "en",
                "titleCandidate": "Best Magnesium for Sleep",
                "h1Candidate": "",
                "articleType": "guide",
                "searchIntent": "commercial investigation",
                "outlineJson": [{"heading": "What to check", "purpose": "Explain evidence"}],
                "requiredEvidence": ["label", "dose", "safety"],
                "healthSensitivity": "medium",
            },
            [{"anchorText": "candidate", "status": "pending"}],
            generated_note="LLM note",
            created_at="2026-05-28T00:00:00+00:00",
        )

        self.assertEqual(article["id"], "draft-article-brief-1")
        self.assertEqual(article["slug"], "best-magnesium-for-sleep")
        self.assertEqual(article["h1"], "Best Magnesium for Sleep")
        self.assertEqual(article["qualityScore"], 75)
        self.assertEqual(article["indexStatus"], "pending")
        self.assertEqual(article["complianceStatus"], "manual_required")
        self.assertEqual(article["createdAt"], "2026-05-28T00:00:00+00:00")

    def test_prompt_and_markdown_preserve_guardrails(self) -> None:
        prompt = topic_article_prompt({"id": "b1"}, [{"briefId": "b1"}])

        self.assertIn("Do not invent prices", prompt)
        self.assertIn("health claims", prompt)

        lines = markdown_article_lines(
            {
                "title": "Draft",
                "locale": "en",
                "type": "guide",
                "publishStatus": "pending",
                "indexStatus": "pending",
                "qualityScore": 70,
                "sections": [{"heading": "Evidence", "purpose": "Verify claims"}],
                "requiredEvidence": ["lab note"],
                "affiliatePlacementCandidates": [{"anchorText": "Candidate", "status": "pending"}],
            }
        )

        self.assertIn("# Draft", lines)
        self.assertIn("- Evidence: Verify claims", lines)
        self.assertIn("- Candidate (pending)", lines)

    def test_health_sensitivity_normalizes_unknown_values(self) -> None:
        self.assertEqual(health_sensitivity_for_brief({"healthSensitivity": "high"}), "high")
        self.assertEqual(health_sensitivity_for_brief({"healthSensitivity": "medium"}), "medium")
        self.assertEqual(health_sensitivity_for_brief({"healthSensitivity": "low"}), "none")


if __name__ == "__main__":
    unittest.main()
