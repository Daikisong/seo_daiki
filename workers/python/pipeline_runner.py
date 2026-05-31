from __future__ import annotations

from datetime import datetime, timezone
import traceback

from workers.python.common import DATA, ensure_dirs, write_json
from workers.python.pipeline_steps import PipelineStep


def run_steps(name: str, steps: list[PipelineStep], continue_on_error: bool, extra: dict[str, object] | None = None) -> str:
    ensure_dirs()
    started_at = datetime.now(timezone.utc)
    results: list[dict[str, object]] = []
    status = "pass"

    for step_name, action in steps:
        step_started_at = datetime.now(timezone.utc)
        try:
            output = action()
            results.append(
                {
                    "name": step_name,
                    "status": "pass",
                    "output": str(output),
                    "output_path": str(output),
                    "started_at": step_started_at.isoformat(),
                    "finished_at": datetime.now(timezone.utc).isoformat(),
                }
            )
        except Exception as error:  # noqa: BLE001 - pipeline report must capture any failed worker step.
            status = "failed"
            results.append(
                {
                    "name": step_name,
                    "status": "failed",
                    "error": str(error),
                    "traceback": traceback.format_exc(),
                    "started_at": step_started_at.isoformat(),
                    "finished_at": datetime.now(timezone.utc).isoformat(),
                }
            )
            if not continue_on_error:
                break

    report = {
        "pipeline": name,
        "status": status,
        "started_at": started_at.isoformat(),
        "finished_at": datetime.now(timezone.utc).isoformat(),
        "steps": results,
        **(extra or {}),
    }
    path = DATA / "exports" / "pipeline_run.json"
    named_path = DATA / "exports" / f"pipeline_{name}_run.json"
    write_json(named_path, report)
    write_json(path, report)
    if status == "failed":
        raise RuntimeError(f"Worker pipeline failed. See {named_path}.")
    return str(named_path)
