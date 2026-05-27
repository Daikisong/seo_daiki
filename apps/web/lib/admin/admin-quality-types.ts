import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import type { QualityGateResult, ValidationIssue } from "@global-import-lab/validators";

export type AdminQualityArticle = Pick<
  Article,
  "evidenceIds" | "id" | "indexStatus" | "internalLinks" | "locale" | "productId"
>;
export type AdminQualityProduct = Pick<Product, "id" | "sellerClaims" | "verifiedClaims">;
export type AdminQualityEvidencePack = Pick<EvidencePack, "locale" | "productId">;

export interface AdminQualityRow<
  TArticle extends AdminQualityArticle = AdminQualityArticle,
  TProduct extends AdminQualityProduct = AdminQualityProduct,
  TEvidencePack extends AdminQualityEvidencePack = AdminQualityEvidencePack
> {
  article: TArticle;
  result: QualityGateResult;
  evidenceCount: number;
  hreflangIssues: ValidationIssue[];
  schemaIssues: ValidationIssue[];
  affiliateIssues: ValidationIssue[];
  duplicateCandidateCount: number;
  product?: TProduct;
  evidencePack?: TEvidencePack;
}

export interface AdminQualityStats {
  indexedPages: number;
  avgInternalLinks: number;
  seoIssueRows: number;
  duplicateCandidates: number;
}
