import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import { runQualityGate } from "@global-import-lab/validators";
import { articleLocaleTypeLabel, duplicateCandidateLabel } from "@/lib/admin/admin-review-model";
import { buildAdminQualityRows, buildAdminQualityStats, issueCodes } from "@/lib/admin/admin-quality-model";
import { readDuplicateCandidateCounts } from "@/lib/admin/admin-section-data";
import { QualityStat } from "./AdminForms";

export async function QualitySection({
  articles,
  evidencePacks,
  products
}: {
  articles: Article[];
  evidencePacks: EvidencePack[];
  products: Product[];
}) {
  const duplicateCandidateCounts = await readDuplicateCandidateCounts();
  const rows = buildAdminQualityRows({
    articles,
    duplicateCandidateCounts,
    evidencePacks,
    evaluateQualityGate: runQualityGate,
    products
  });
  const stats = buildAdminQualityStats(rows);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <QualityStat label="Indexed pages" value={stats.indexedPages} />
        <QualityStat label="Avg internal links" value={stats.avgInternalLinks.toFixed(1)} />
        <QualityStat label="SEO issue rows" value={stats.seoIssueRows} />
        <QualityStat label="Duplicate candidates" value={stats.duplicateCandidates} />
      </div>
      <table>
        <thead>
          <tr>
            <th>Article</th>
            <th>Stored status</th>
            <th>Gate status</th>
            <th>Score</th>
            <th>Evidence</th>
            <th>Internal links</th>
            <th>Hreflang issues</th>
            <th>Schema issues</th>
            <th>Affiliate rel issues</th>
            <th>Duplicate candidates</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(
            ({
              affiliateIssues,
              article,
              duplicateCandidateCount,
              evidenceCount,
              hreflangIssues,
              result,
              schemaIssues
            }) => (
              <tr key={article.id}>
                <td>
                  <p>{article.title}</p>
                  <p className="text-xs text-neutral-500">{articleLocaleTypeLabel(article)}</p>
                </td>
                <td>{article.indexStatus}</td>
                <td>{result.indexStatus}</td>
                <td>{result.score}</td>
                <td>{evidenceCount}</td>
                <td>{article.internalLinks.length}</td>
                <td>{issueCodes(hreflangIssues)}</td>
                <td>{issueCodes(schemaIssues)}</td>
                <td>{issueCodes(affiliateIssues)}</td>
                <td>{duplicateCandidateLabel(duplicateCandidateCount)}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
