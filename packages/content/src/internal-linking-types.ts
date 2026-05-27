import type { Article } from "@global-import-lab/types";

export type InternalLinkArticle = Pick<
  Article,
  | "contentMdx"
  | "evidenceIds"
  | "h1"
  | "id"
  | "indexStatus"
  | "locale"
  | "metaDescription"
  | "productId"
  | "publishStatus"
  | "sections"
  | "slug"
  | "summary"
  | "title"
  | "type"
> & { group: string };
