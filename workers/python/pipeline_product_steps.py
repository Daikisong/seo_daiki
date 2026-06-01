from __future__ import annotations

from pathlib import Path

from workers.python.common import DATA
from workers.python.feature_flags import ENABLE_PRODUCT_CANDIDATE_DISCOVERY
from workers.python.intelligence.product_candidate_engine import (
    analyze_product_candidates,
    build_product_analysis_block,
    discover_product_candidates,
    import_product_candidates,
)
from workers.python.intelligence.trend_monetization_router import route_trend_monetization
from workers.python.pipeline_types import PipelineStep


def post_to_product_analysis_steps(candidates_file: Path | None = None, article_id: str | None = None) -> list[PipelineStep]:
    if not ENABLE_PRODUCT_CANDIDATE_DISCOVERY:
        raise RuntimeError("ENABLE_PRODUCT_CANDIDATE_DISCOVERY=false; product candidate analysis is disabled.")
    return [
        ("trend:route-monetization", lambda: route_trend_monetization(article_id)),
        (
            "products:import-candidates",
            lambda: import_product_candidates(candidates_file or DATA / "seeds" / "product-candidates.csv"),
        ),
        ("products:discover-candidates", lambda: discover_product_candidates(article_id)),
        ("products:analyze-candidates", lambda: analyze_product_candidates(article_id)),
        ("products:build-analysis-block", lambda: build_product_analysis_block(article_id)),
    ]
