export const indexStatuses = ["index", "noindex", "pending", "refresh_needed", "merge_candidate"] as const;
export const publishStatuses = ["draft", "pending", "published"] as const;
export const adminEntityTypes = [
  "product",
  "variant",
  "seller-claim",
  "verified-claim",
  "market-risk",
  "evidence-pack",
  "article"
] as const;
export const adminRecordActions = ["archive", "delete"] as const;

export type IndexStatusInput = (typeof indexStatuses)[number];
export type PublishStatusInput = (typeof publishStatuses)[number];
export type AdminEntityType = (typeof adminEntityTypes)[number];
export type AdminRecordAction = (typeof adminRecordActions)[number];

export function isIndexStatus(value: string): value is IndexStatusInput {
  return indexStatuses.includes(value as IndexStatusInput);
}

export function isPublishStatus(value: string): value is PublishStatusInput {
  return publishStatuses.includes(value as PublishStatusInput);
}

export function isAdminEntityType(value: string): value is AdminEntityType {
  return adminEntityTypes.includes(value as AdminEntityType);
}

export function isAdminRecordAction(value: string): value is AdminRecordAction {
  return adminRecordActions.includes(value as AdminRecordAction);
}
