from __future__ import annotations

import json
from typing import Any
import urllib.request


def post_json(url: str, payload: dict[str, Any], headers: dict[str, str], timeout: int = 120) -> dict[str, Any]:
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"content-type": "application/json", **headers},
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def join_text_parts(parts: list[str]) -> str:
    return "\n".join(part.strip() for part in parts if part and part.strip()).strip()
