from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class DispatchResult:
    handled: bool
    value: Any = None


NOT_HANDLED = DispatchResult(False)


def handled(value: Any) -> DispatchResult:
    return DispatchResult(True, value)
