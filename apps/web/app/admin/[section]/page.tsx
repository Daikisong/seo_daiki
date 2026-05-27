import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  adminSections,
  indexStatuses,
  publishStatuses,
  type AdminSection
} from "@/lib/admin/admin-section-config";
import {
  AdminPanel,
  QualityStat,
  QueuePublishingJobForm,
  RecordActionForm
} from "./AdminForms";
import { buildAdminQualityRows, buildAdminQualityStats, issueCodes } from "@/lib/admin/admin-quality-model";
import {
  readAuditLogs,
  readComplianceRows,
  readDuplicateCandidateCounts,
  readLocalizationRows,
} from "@/lib/admin/admin-section-data";
import { getAllArticles, getAllEvidencePacks, getAllProducts } from "@/lib/content/repository";
import { runQualityGate } from "@global-import-lab/validators";
import { BriefsSection, PublishingJobsSection, TopicsSection, TrendsSection } from "./ContentWorkflowSections";
import { MerchantsSection, OfferMatchingSection, OffersSection, PlacementsSection } from "./MonetizationSections";
import { EvidenceSection, ProductsSection } from "./ProductEvidenceSections";
import { SearchConsoleSection } from "./SearchConsoleSection";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ section: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export function generateStaticParams() {
  return adminSections.map((section) => ({ section }));
}

export default async function AdminSectionPage({ params, searchParams }: PageProps) {
  const { section } = await params;
  const filters = await searchParams;
  if (!adminSections.includes(section as AdminSection)) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-4xl font-semibold">Admin: {section}</h1>
        <div className="mt-6 rounded-md border border-neutral-200 bg-white p-4">
          <AdminTable filters={filters ?? {}} section={section} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

async function AdminTable({ filters, section }: { filters: Record<string, string | string[] | undefined>; section: string }) {
  const [articles, evidencePacks, products] = await Promise.all([
    getAllArticles(),
    getAllEvidencePacks(),
    getAllProducts()
  ]);

  if (section === "products") {
    return <ProductsSection products={products} />;
  }

  if (section === "evidence") {
    return <EvidenceSection evidencePacks={evidencePacks} products={products} />;
  }

  if (section === "quality") {
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
                    <p className="text-xs text-neutral-500">
                      {article.locale} / {article.type}
                    </p>
                  </td>
                  <td>{article.indexStatus}</td>
                  <td>{result.indexStatus}</td>
                  <td>{result.score}</td>
                  <td>{evidenceCount}</td>
                  <td>{article.internalLinks.length}</td>
                  <td>{issueCodes(hreflangIssues)}</td>
                  <td>{issueCodes(schemaIssues)}</td>
                  <td>{issueCodes(affiliateIssues)}</td>
                  <td>{duplicateCandidateCount || "-"}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    );
  }

  if (section === "search-console") {
    return <SearchConsoleSection />;
  }

  if (section === "audit") {
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
                  <td>{log.actor ?? "-"}</td>
                  <td>{log.summary ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminPanel>
    );
  }

  if (section === "trends") {
    return <TrendsSection filters={filters} />;
  }

  if (section === "topics") {
    return <TopicsSection />;
  }

  if (section === "briefs") {
    return <BriefsSection />;
  }

  if (section === "publishing-jobs") {
    return <PublishingJobsSection />;
  }

  if (section === "compliance") {
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
                    <p className="text-xs text-neutral-500">{row.locale}/{row.type}/{row.slug}</p>
                  </td>
                  <td>{row.publishStatus}/{row.indexStatus}</td>
                  <td>{row.healthSensitivity}/{row.complianceStatus}</td>
                  <td>{row.issues.join(", ") || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminPanel>
    );
  }

  if (section === "localization") {
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
                  <td>{row.variants.map((variant) => `${variant.locale}:${variant.status}`).join(", ")}</td>
                  <td>{row.variants.map((variant) => `${variant.locale} ${variant.localizationDepthScore}`).join(", ")}</td>
                  <td>
                    <QueuePublishingJobForm
                      groupId={row.id}
                      jobType="sync_hreflang_group"
                      locale={row.variants[0]?.locale || "en"}
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

  if (section === "merchants") {
    return <MerchantsSection />;
  }

  if (section === "offers") {
    return <OffersSection />;
  }

  if (section === "offer-matching") {
    return <OfferMatchingSection />;
  }

  if (section === "placements") {
    return <PlacementsSection />;
  }

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
