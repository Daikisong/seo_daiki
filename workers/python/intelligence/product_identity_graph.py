from __future__ import annotations

from collections import defaultdict
from difflib import SequenceMatcher
import re
from typing import Any

from workers.python.common import DATA, read_json, slugify, write_json


def build_identity_graph() -> str:
    candidates = read_json(DATA / "raw" / "raw_product_candidates.json", [])
    normalized = [normalize_candidate(item) for item in candidates if isinstance(item, dict)]
    groups = group_candidates(normalized)
    graph = [identity_group(group, normalized) for group in groups]
    path = write_json(DATA / "snapshots" / "product_identity_graph.json", graph)
    return str(path)


def normalize_candidate(item: dict[str, Any]) -> dict[str, Any]:
    title = string_value(item.get("title"))
    tokens = tokenize(title)
    brand = tokens[0] if tokens else "unknown"
    spec_tokens = sorted({token for token in tokens if is_spec_token(token)})
    model_tokens = sorted({token for token in tokens if is_model_token(token)})
    image_url = string_value(item.get("image_url"))

    return {
        **item,
        "_tokens": tokens,
        "_brand_token": brand,
        "_spec_tokens": spec_tokens,
        "_model_tokens": model_tokens,
        "_image_fingerprint": slugify(image_url.rsplit("/", 1)[-1].rsplit(".", 1)[0]),
        "_seller_tokens": tokenize(string_value(item.get("seller"))),
        "_title_normalized": " ".join(tokens)
    }


def group_candidates(candidates: list[dict[str, Any]]) -> list[list[dict[str, Any]]]:
    groups: list[list[dict[str, Any]]] = []
    for item in sorted(candidates, key=lambda row: string_value(row.get("product_id"))):
        best_group: list[dict[str, Any]] | None = None
        best_score = 0.0
        for group in groups:
            group_score = max(identity_score(item, member)["confidence"] for member in group)
            if group_score > best_score:
                best_group = group
                best_score = group_score

        if best_group is not None and best_score >= 0.78:
            best_group.append(item)
        else:
            groups.append([item])

    return groups


def identity_group(group: list[dict[str, Any]], all_candidates: list[dict[str, Any]]) -> dict[str, Any]:
    canonical = canonical_item(group)
    duplicate_candidates = [
        duplicate_candidate(canonical, candidate)
        for candidate in all_candidates
        if candidate.get("product_id") != canonical.get("product_id")
    ]
    duplicate_candidates = sorted(
        duplicate_candidates,
        key=lambda row: (-float(row["confidence"]), string_value(row["product_id"]))
    )[:5]

    confidence = group_confidence(group)
    return {
        "canonical_slug": canonical_slug(canonical),
        "canonical_product": {
            "product_id": canonical.get("product_id"),
            "title": canonical.get("title"),
            "source_url": canonical.get("source_url"),
            "category": canonical.get("category"),
            "brand_token": canonical.get("_brand_token"),
            "spec_tokens": canonical.get("_spec_tokens"),
            "model_tokens": canonical.get("_model_tokens"),
            "image_fingerprint": canonical.get("_image_fingerprint"),
            "seller": canonical.get("seller")
        },
        "aliases": [item.get("title") for item in group],
        "source_product_ids": [item.get("product_id") for item in group],
        "duplicate_candidates": duplicate_candidates,
        "identity_signals": {
            "brand_token": canonical.get("_brand_token"),
            "spec_tokens": canonical.get("_spec_tokens"),
            "seller_tokens": canonical.get("_seller_tokens"),
            "image_fingerprint": canonical.get("_image_fingerprint")
        },
        "confidence": confidence
    }


def duplicate_candidate(source: dict[str, Any], candidate: dict[str, Any]) -> dict[str, Any]:
    score = identity_score(source, candidate)
    decision = "merge_candidate" if score["confidence"] >= 0.78 else "keep_separate"
    if score["score_parts"]["spec_token"] == 0 and source.get("_brand_token") == candidate.get("_brand_token"):
        decision = "same_brand_different_spec"

    return {
        "product_id": candidate.get("product_id"),
        "title": candidate.get("title"),
        "confidence": score["confidence"],
        "decision": decision,
        "score_parts": score["score_parts"]
    }


def identity_score(left: dict[str, Any], right: dict[str, Any]) -> dict[str, Any]:
    title_similarity = SequenceMatcher(
        None,
        string_value(left.get("_title_normalized")),
        string_value(right.get("_title_normalized"))
    ).ratio()
    image_hash = 1.0 if left.get("_image_fingerprint") and left.get("_image_fingerprint") == right.get("_image_fingerprint") else 0.0
    brand_token = 1.0 if left.get("_brand_token") and left.get("_brand_token") == right.get("_brand_token") else 0.0
    spec_token = jaccard(set_value(left.get("_spec_tokens")), set_value(right.get("_spec_tokens")))
    seller_overlap = jaccard(set_value(left.get("_seller_tokens")), set_value(right.get("_seller_tokens")))
    model_number = jaccard(set_value(left.get("_model_tokens")), set_value(right.get("_model_tokens")))

    confidence = (
        title_similarity * 0.3
        + image_hash * 0.15
        + brand_token * 0.15
        + spec_token * 0.2
        + seller_overlap * 0.1
        + model_number * 0.1
    )

    if left.get("category") != right.get("category"):
        confidence = min(confidence, 0.49)
    if brand_token == 0:
        confidence = min(confidence, 0.65)

    score_parts = {
        "title_similarity": round(title_similarity, 3),
        "image_hash": round(image_hash, 3),
        "brand_token": round(brand_token, 3),
        "spec_token": round(spec_token, 3),
        "seller_overlap": round(seller_overlap, 3),
        "model_number": round(model_number, 3)
    }
    return {"confidence": round(confidence, 3), "score_parts": score_parts}


def canonical_item(group: list[dict[str, Any]]) -> dict[str, Any]:
    return max(
        group,
        key=lambda item: (
            number_value(item.get("orders")),
            number_value(item.get("rating")),
            -number_value(item.get("price")),
            string_value(item.get("product_id"))
        )
    )


def group_confidence(group: list[dict[str, Any]]) -> float:
    if len(group) == 1:
        item = group[0]
        signals = [
            bool(item.get("_brand_token")),
            bool(item.get("_spec_tokens")),
            bool(item.get("_image_fingerprint")),
            bool(item.get("seller")),
            bool(item.get("category"))
        ]
        return round(0.58 + sum(signals) * 0.04, 3)

    pair_scores = [
        identity_score(left, right)["confidence"]
        for index, left in enumerate(group)
        for right in group[index + 1 :]
    ]
    return round(sum(pair_scores) / len(pair_scores), 3)


def canonical_slug(item: dict[str, Any]) -> str:
    parts = [
        string_value(item.get("_brand_token")),
        *list_value(item.get("_spec_tokens")),
        string_value(item.get("category"))
    ]
    return slugify(" ".join(part for part in parts if part))


def tokenize(value: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", value.lower().replace("usb c", "usb-c"))


def is_spec_token(token: str) -> bool:
    return bool(re.fullmatch(r"\d+(w|mah|wh|nm|m|a)?", token)) or token in {"pd", "pps", "zigbee", "gan"}


def is_model_token(token: str) -> bool:
    return bool(re.search(r"[a-z]", token) and re.search(r"\d", token))


def jaccard(left: set[str], right: set[str]) -> float:
    if not left and not right:
        return 0.0
    return len(left & right) / len(left | right)


def set_value(value: Any) -> set[str]:
    return {str(item) for item in value} if isinstance(value, list) else set()


def list_value(value: Any) -> list[str]:
    return [str(item) for item in value] if isinstance(value, list) else []


def string_value(value: Any) -> str:
    return str(value).strip() if value is not None else ""


def number_value(value: Any) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0
