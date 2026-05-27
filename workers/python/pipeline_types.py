from __future__ import annotations

from collections.abc import Callable

PipelineStep = tuple[str, Callable[[], object]]
