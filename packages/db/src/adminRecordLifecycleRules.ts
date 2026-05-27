import type { AdminEntityType } from "./adminMutationValues";

export function archiveSummary(entityType: AdminEntityType) {
  if (entityType === "product") {
    return "Archived product and marked related articles noindex/draft.";
  }
  if (entityType === "article") {
    return "Archived article and marked it noindex/draft.";
  }
  return `Archived ${entityType}.`;
}

export function archiveMutationData(entityType: AdminEntityType, archivedAt: Date) {
  if (entityType === "article") {
    return { archivedAt, indexStatus: "noindex" as const, publishStatus: "draft" as const };
  }
  return { archivedAt };
}

export function shouldArchiveRelatedArticles(entityType: AdminEntityType) {
  return entityType === "product";
}

export function relatedArticleArchiveData(archivedAt: Date) {
  return { archivedAt, indexStatus: "noindex" as const, publishStatus: "draft" as const };
}

export function deleteSummary(entityType: AdminEntityType) {
  return `Deleted ${entityType}.`;
}
