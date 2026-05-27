from __future__ import annotations

from typing import Any

from workers.python.common import slugify
from workers.python.intelligence.product_identity_values import is_model_token, is_spec_token, string_value, tokenize


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
        "_title_normalized": " ".join(tokens),
    }
