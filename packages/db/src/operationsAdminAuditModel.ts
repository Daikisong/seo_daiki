export function adminOperationAction(input: { id?: string }) {
  return input.id ? "update" : "create";
}

export function merchantAuditSummary(input: { id?: string }, slug: string) {
  return `${input.id ? "Updated" : "Created"} merchant ${slug}.`;
}

export function offerAuditSummary(input: { id?: string }, title: string) {
  return `${input.id ? "Updated" : "Created"} offer ${title}.`;
}
