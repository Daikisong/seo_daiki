import type { QualityGateResult } from "@global-import-lab/validators";
import type {
  AdminQualityArticle,
  AdminQualityEvidencePack,
  AdminQualityProduct,
  AdminQualityRow
} from "./admin-quality-types";
import { issuesWithPrefix } from "./admin-quality-issues";

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
