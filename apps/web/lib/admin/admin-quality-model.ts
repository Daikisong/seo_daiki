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

export function buildAdminQualityRows<
  TArticle extends AdminQualityArticle,
  TProduct extends AdminQualityProduct,
  TEvidencePack extends AdminQualityEvidencePack
>(input: {
  articles: TArticle[];
  duplicateCandidateCounts: Record<string, number>;
  evidencePacks: TEvidencePack[];
  evaluateQualityGate: (input: { article: TArticle; product?: TProduct; evidencePack?: TEvidencePack }) => QualityGateResult;
  products: TProduct[];
}): AdminQualityRow<TArticle, TProduct, TEvidencePack>[] {
  return input.articles.map((article) => {
    const product = input.products.find((item) => item.id === article.productId);
    const evidencePack = input.evidencePacks.find(
      (pack) => pack.productId === article.productId && pack.locale === article.locale
    );
    const result = input.evaluateQualityGate({ article, product, evidencePack });
    return {
      article,
      result,
      evidenceCount: article.evidenceIds.length + (product?.sellerClaims.length ?? 0) + (product?.verifiedClaims.length ?? 0),
      hreflangIssues: issuesWithPrefix(result.issues, "hreflang"),
      schemaIssues: issuesWithPrefix(result.issues, "schema"),
      affiliateIssues: issuesWithPrefix(result.issues, "affiliate"),
      duplicateCandidateCount: article.productId ? input.duplicateCandidateCounts[article.productId] ?? 0 : 0,
      product,
      evidencePack
    };
  });
}

export function buildAdminQualityStats(rows: AdminQualityRow[]): AdminQualityStats {
  return {
    indexedPages: rows.filter(({ article }) => article.indexStatus === "index").length,
    avgInternalLinks: average(rows.map(({ article }) => article.internalLinks.length)),
    seoIssueRows: rows.filter(hasSeoIssues).length,
    duplicateCandidates: rows.reduce((sum, row) => sum + row.duplicateCandidateCount, 0)
  };
}

export function issueCodes(issues: ValidationIssue[]) {
  return issues.length ? issues.map((issue) => issue.code).join(", ") : "-";
}

function hasSeoIssues(row: Pick<AdminQualityRow, "affiliateIssues" | "hreflangIssues" | "schemaIssues">) {
  return row.affiliateIssues.length > 0 || row.hreflangIssues.length > 0 || row.schemaIssues.length > 0;
}

function issuesWithPrefix(issues: ValidationIssue[], prefix: string) {
  return issues.filter((issue) => issue.code.startsWith(prefix));
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
