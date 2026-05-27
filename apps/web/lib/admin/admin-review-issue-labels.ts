export function issueListLabel(issues: string[]) {
  return issues.length > 0 ? issues.join(", ") : "-";
}

export function duplicateCandidateLabel(count: number) {
  return count || "-";
}
