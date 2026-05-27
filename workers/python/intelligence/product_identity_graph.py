from __future__ import annotations

from workers.python.common import DATA, read_json, write_json
from workers.python.intelligence.product_identity_normalization import normalize_candidate
from workers.python.intelligence.product_identity_records import group_candidates, identity_graph_records, identity_group
from workers.python.intelligence.product_identity_scoring import (
    canonical_item,
    canonical_slug,
    duplicate_candidate,
    group_confidence,
    identity_score,
)
from workers.python.intelligence.product_identity_values import (
    is_model_token,
    is_spec_token,
    jaccard,
    list_value,
    number_value,
    set_value,
    string_value,
    tokenize,
)


def build_identity_graph() -> str:
    candidates = read_json(DATA / "raw" / "raw_product_candidates.json", [])
    graph = identity_graph_records(candidates)
    path = write_json(DATA / "snapshots" / "product_identity_graph.json", graph)
    return str(path)


__all__ = [
    "build_identity_graph",
    "canonical_item",
    "canonical_slug",
    "duplicate_candidate",
    "group_candidates",
    "group_confidence",
    "identity_graph_records",
    "identity_group",
    "identity_score",
    "is_model_token",
    "is_spec_token",
    "jaccard",
    "list_value",
    "normalize_candidate",
    "number_value",
    "set_value",
    "string_value",
    "tokenize",
]
