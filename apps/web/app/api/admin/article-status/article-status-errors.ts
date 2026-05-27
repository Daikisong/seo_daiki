export interface AdminPublishGateIssuePayload {
  code: string;
  message: string;
  severity: "blocker" | "warning";
}

export interface AdminPublishGateErrorLike {
  name: "AdminPublishGateError";
  articleId: string;
  gateStatus: string;
  gateScore: number;
  issues: AdminPublishGateIssuePayload[];
}

export function isAdminPublishGateError(error: unknown): error is AdminPublishGateErrorLike {
  if (!error || typeof error !== "object") {
    return false;
  }

  return (
    "name" in error &&
    error.name === "AdminPublishGateError" &&
    "articleId" in error &&
    "gateStatus" in error &&
    "gateScore" in error &&
    "issues" in error &&
    Array.isArray(error.issues)
  );
}

export function adminPublishGateErrorPayload(error: AdminPublishGateErrorLike) {
  return {
    error: "Article publish gate failed.",
    articleId: error.articleId,
    gateStatus: error.gateStatus,
    gateScore: error.gateScore,
    issues: error.issues.map((issue) => ({
      code: issue.code,
      message: issue.message,
      severity: issue.severity
    }))
  };
}
