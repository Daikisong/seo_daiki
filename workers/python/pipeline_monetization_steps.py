from __future__ import annotations

from workers.python.intelligence.monetization_review import create_monetization_review, draft_monetized_placements
from workers.python.pipeline_types import PipelineStep


def monetization_review_steps(article_id: str | None = None) -> list[PipelineStep]:
    return [
        ("monetization:create-review", lambda: create_monetization_review(article_id)),
        ("monetization:draft-placements", draft_monetized_placements),
    ]
