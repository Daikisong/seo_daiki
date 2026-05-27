import type { Article, EvidencePack, Product } from "@global-import-lab/types";
import { runQualityGate } from "@global-import-lab/validators";
import { indexStatuses, publishStatuses } from "@/lib/admin/admin-section-config";
import {
  articleLocaleTypeLabel,
  articlePathLabel,
  articleStoredStatusLabel,
  auditActorLabel,
  auditSummaryLabel,
  duplicateCandidateLabel,
  healthComplianceLabel,
  issueListLabel,
  localizationDepthLabel,
  localizationPrimaryLocale,
  localizationVariantStatusLabel
} from "@/lib/admin/admin-review-model";
import { buildAdminQualityRows, buildAdminQualityStats, issueCodes } from "@/lib/admin/admin-quality-model";
import {
  readAuditLogs,
  readComplianceRows,
  readDuplicateCandidateCounts,
  readLocalizationRows
} from "@/lib/admin/admin-section-data";
import {
  AdminPanel,
  QualityStat,
  QueuePublishingJobForm,
  RecordActionForm
} from "./AdminForms";

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

export async function AuditSection() {
  const logs = await readAuditLogs();
  return (
    <AdminPanel title="Audit log">
      {logs.length === 0 ? (
        <p className="text-sm text-neutral-700">No audit logs are available. Connect Postgres and run admin mutations to populate this table.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Created</th>
              <th>Entity</th>
              <th>Action</th>
              <th>Actor</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.createdAt}</td>
                <td>
                  <p>{log.entityType}</p>
                  <p className="text-xs text-neutral-500">{log.entityId}</p>
                </td>
                <td>{log.action}</td>
                <td>{auditActorLabel(log.actor)}</td>
                <td>{auditSummaryLabel(log.summary)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminPanel>
  );
}

export async function ComplianceSection({
  articles,
  evidencePacks,
  products
}: {
  articles: Article[];
  evidencePacks: EvidencePack[];
  products: Product[];
}) {
  const rows = await readComplianceRows(articles, products, evidencePacks);
  return (
    <AdminPanel title="Compliance queue">
      {rows.length === 0 ? (
        <p className="text-sm text-neutral-700">No compliance rows are available. Health, localization, unsafe redirect, and gate blockers appear here after validation.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Article</th>
              <th>Status</th>
              <th>Health</th>
              <th>Issues</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <p className="font-semibold">{row.title}</p>
                  <p className="text-xs text-neutral-500">{articlePathLabel(row)}</p>
                </td>
                <td>{articleStoredStatusLabel(row)}</td>
                <td>{healthComplianceLabel(row)}</td>
                <td>{issueListLabel(row.issues)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminPanel>
  );
}

export async function LocalizationSection() {
  const rows = await readLocalizationRows();
  return (
    <AdminPanel title="Localization">
      {rows.length === 0 ? (
        <p className="text-sm text-neutral-700">No localization groups or localized draft exports are available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Group</th>
              <th>Source</th>
              <th>Variants</th>
              <th>Depth</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <p className="font-semibold">{row.topicLabel}</p>
                  <p className="text-xs text-neutral-500">{row.id}</p>
                </td>
                <td>{row.sourceLabel}</td>
                <td>{localizationVariantStatusLabel(row.variants)}</td>
                <td>{localizationDepthLabel(row.variants)}</td>
                <td>
                  <QueuePublishingJobForm
                    groupId={row.id}
                    jobType="sync_hreflang_group"
                    locale={localizationPrimaryLocale(row.variants)}
                    returnTo="/admin/localization/"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminPanel>
  );
}

export function ArticlesSection({ articles }: { articles: Article[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Article</th>
          <th>Locale</th>
          <th>Type</th>
          <th>Index status</th>
          <th>Publish status</th>
          <th>Update</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {articles.map((article) => (
          <tr key={article.id}>
            <td>{article.title}</td>
            <td>{article.locale}</td>
            <td>{article.type}</td>
            <td>{article.indexStatus}</td>
            <td>{article.publishStatus}</td>
            <td>
              <form action="/api/admin/article-status" className="grid min-w-80 gap-2" method="post">
                <input name="id" type="hidden" value={article.id} />
                <input name="returnTo" type="hidden" value="/admin/articles/" />
                <input
                  className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
                  name="adminToken"
                  placeholder="Admin token"
                  type="password"
                />
                <div className="grid gap-2 md:grid-cols-3">
                  <select
                    className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
                    defaultValue={article.indexStatus}
                    name="indexStatus"
                  >
                    {indexStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <select
                    className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
                    defaultValue={article.publishStatus}
                    name="publishStatus"
                  >
                    {publishStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <input
                    className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
                    defaultValue={article.qualityScore}
                    max={100}
                    min={0}
                    name="qualityScore"
                    type="number"
                  />
                </div>
                <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">
                  Save
                </button>
              </form>
            </td>
            <td>
              <RecordActionForm entityId={article.id} entityType="article" returnTo="/admin/articles/" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
