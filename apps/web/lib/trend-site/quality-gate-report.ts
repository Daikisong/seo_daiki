import type { PipelineQualityGateResult, RepairTask } from "./pipeline-models";
import type { QualityGateBlocker, QualityGateResult } from "./quality-gate";

export function buildQualityGateReport(
  result: QualityGateResult,
): PipelineQualityGateResult {
  const blockers = allQualityGateBlockers(result);
  const status = qualityGateReportStatus(result, blockers);

  return {
    status,
    contentGatePass: status === "PASS" && result.canPublishIndexable,
    sourceStatus: result.status,
    next_step: nextStepForReport(result, status),
    blockers: blockers.map((blocker) => ({
      code: blocker.code,
      target: blocker.target,
      severity: blocker.severity,
      message: blocker.message,
      repair_action: blocker.repairAction,
    })),
  };
}

export function repairTasksFromQualityGateReport(
  report: PipelineQualityGateResult,
): RepairTask[] {
  return report.blockers.map((blocker, index) => ({
    id: `quality-gate-${index + 1}`,
    source: "quality-gate",
    code: blocker.code,
    severity:
      blocker.severity === "hard" || blocker.severity === "hold"
        ? "blocked"
        : "repair",
    target: blocker.target,
    title: blocker.message,
    action: blocker.repair_action,
  }));
}

function allQualityGateBlockers(
  result: QualityGateResult,
): QualityGateBlocker[] {
  return [
    ...result.hardGate.blockers,
    ...result.repairGate.blockers,
    ...result.editorialGate.blockers,
    ...result.hreflangGate.blockers,
  ];
}

function qualityGateReportStatus(
  result: QualityGateResult,
  blockers: QualityGateBlocker[],
): PipelineQualityGateResult["status"] {
  if (result.status === "PASS" && blockers.length === 0) {
    return "PASS";
  }
  if (
    result.hardGate.blockers.length > 0 ||
    result.hreflangGate.blockers.length > 0
  ) {
    return "BLOCKED";
  }
  return "REPAIR_REQUIRED";
}

function nextStepForReport(
  result: QualityGateResult,
  status: PipelineQualityGateResult["status"],
): PipelineQualityGateResult["next_step"] {
  if (status === "PASS") {
    return "manual_publish_review";
  }
  if (result.hreflangGate.blockers.length > 0) {
    return "fix_hreflang_cluster";
  }
  if (result.status === "HOLD_SOURCE_INSUFFICIENT") {
    return "collect_evidence";
  }
  if (status === "REPAIR_REQUIRED") {
    return "repair_and_rerun";
  }
  return "blocked";
}
