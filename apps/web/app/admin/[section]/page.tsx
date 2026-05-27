import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  adminLocales as locales,
  adminSections,
  contentBriefStatuses,
  indexStatuses,
  publishStatuses,
  refreshSuggestionStatuses,
  topicStatuses,
  type AdminSection
} from "@/lib/admin/admin-section-config";
import {
  readAffiliateMerchants,
  readAffiliateOffers,
  readAffiliatePlacementCandidates,
  readAffiliatePlacements,
  readAuditLogs,
  readComplianceRows,
  readContentBriefRows,
  readDuplicateCandidateCounts,
  readLabEvidenceAssets,
  readLocalizationRows,
  readPersistedRefreshSuggestions,
  readPublishingJobRows,
  readTopicRows,
  readTrendRows
} from "@/lib/admin/admin-section-data";
import { average, scoreBreakdownSummary, stringFromSearchParam } from "@/lib/admin/admin-section-utils";
import { readSearchConsoleReport } from "@/lib/admin/search-console-report";
import { getAllArticles, getAllEvidencePacks, getAllProducts } from "@/lib/content/repository";
import { runQualityGate } from "@global-import-lab/validators";

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
    return (
      <div className="space-y-8">
        <AdminPanel title="Create product">
          <ProductForm />
        </AdminPanel>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Evidence</th>
              <th>Edit product</th>
              <th>Add variant</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <p className="font-semibold">{product.canonicalName}</p>
                  <p className="text-sm text-neutral-600">{product.category}</p>
                </td>
                <td>
                  <p>{product.sellerClaims.length + product.verifiedClaims.length} claims</p>
                  <p>{product.marketRisks.length} risks</p>
                  <p>{product.variants.length} variants</p>
                </td>
                <td>
                  <ProductForm product={product} />
                </td>
                <td>
                  <VariantForm productId={product.id} />
                </td>
                <td>
                  <RecordActionForm entityId={product.id} entityType="product" returnTo="/admin/products/" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AdminPanel title="Existing variants">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th>Edit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.flatMap((product) =>
                product.variants.map((variant) => (
                  <tr key={variant.id}>
                    <td>{product.canonicalName}</td>
                    <td>{variant.optionName}</td>
                    <td>
                      <VariantForm productId={product.id} variant={variant} />
                    </td>
                    <td>
                      <RecordActionForm entityId={variant.id} entityType="variant" returnTo="/admin/products/" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </AdminPanel>
      </div>
    );
  }

  if (section === "evidence") {
    const labEvidenceAssets = await readLabEvidenceAssets();
    const verifiedClaimOptions = products.flatMap((product) =>
      product.verifiedClaims.map((claim) => ({
        id: claim.id,
        label: `${product.canonicalName}: ${claim.testType} ${claim.resultValue}${claim.unit ? ` ${claim.unit}` : ""}`
      }))
    );

    return (
      <div className="space-y-6">
        <AdminPanel title="Add seller claim">
          <SellerClaimForm products={products} />
        </AdminPanel>
        <AdminPanel title="Add verified claim">
          <VerifiedClaimForm labEvidenceAssets={labEvidenceAssets} listId="new-verified-claim-evidence-url" products={products} />
        </AdminPanel>
        <AdminPanel title="Add market risk">
          <MarketRiskForm products={products} />
        </AdminPanel>
        <AdminPanel title="Create evidence pack">
          <EvidencePackForm products={products} />
        </AdminPanel>
        <form
          action="/api/admin/lab-evidence"
          className="grid gap-3 rounded-md border border-neutral-200 p-4 md:grid-cols-3"
          encType="multipart/form-data"
          method="post"
        >
          <input name="returnTo" type="hidden" value="/admin/evidence/" />
          <label className="text-sm">
            <span className="block text-neutral-600">Admin token</span>
            <input className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" name="adminToken" type="password" />
          </label>
          <label className="text-sm">
            <span className="block text-neutral-600">Product</span>
            <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" name="productId">
              <option value="">Unassigned</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.canonicalName}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-neutral-600">Measurement</span>
            <input
              className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1"
              name="measurementType"
              placeholder="sustained_output"
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="block text-neutral-600">File</span>
            <input className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" name="file" type="file" />
          </label>
          <label className="text-sm">
            <span className="block text-neutral-600">Verified claim ID</span>
            <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" name="verifiedClaimId">
              <option value="">Unassigned</option>
              {verifiedClaimOptions.map((claim) => (
                <option key={claim.id} value={claim.id}>
                  {claim.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm md:col-span-2">
            <span className="block text-neutral-600">Notes</span>
            <input className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" name="notes" />
          </label>
          <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">
            Upload evidence
          </button>
        </form>
        <AdminPanel title="Existing lab evidence files">
          {labEvidenceAssets.length === 0 ? (
            <p className="text-sm text-neutral-700">No database-backed lab evidence assets are available yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>File</th>
                  <th>Measurement</th>
                  <th>Product</th>
                  <th>Verified claim</th>
                  <th>Size</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                {labEvidenceAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td>{asset.fileName}</td>
                    <td>{asset.measurementType}</td>
                    <td>{asset.productId ?? "-"}</td>
                    <td>{asset.verifiedClaimId ?? "-"}</td>
                    <td>{asset.sizeBytes}</td>
                    <td>
                      <a className="text-teal-800 underline" href={asset.publicUrl}>
                        {asset.publicUrl}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminPanel>
        <table>
          <thead>
            <tr>
              <th>Pack</th>
              <th>Locale</th>
              <th>Allowed claims</th>
              <th>Forbidden claims</th>
              <th>Edit JSON</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {evidencePacks.map((pack) => (
              <tr key={pack.id}>
                <td>{pack.id}</td>
                <td>{pack.locale}</td>
                <td>{pack.packJson.allowedClaims.length}</td>
                <td>{pack.packJson.forbiddenClaims.length}</td>
                <td>
                  <EvidencePackForm pack={pack} products={products} />
                </td>
                <td>
                  <RecordActionForm entityId={pack.id} entityType="evidence-pack" returnTo="/admin/evidence/" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AdminPanel title="Existing seller claims">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Claim</th>
                <th>Edit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.flatMap((product) =>
                product.sellerClaims.map((claim) => (
                  <tr key={claim.id}>
                    <td>{product.canonicalName}</td>
                    <td>
                      {claim.claimType}: {claim.claimValue}
                    </td>
                    <td>
                      <SellerClaimForm claim={claim} products={products} />
                    </td>
                    <td>
                      <RecordActionForm entityId={claim.id} entityType="seller-claim" returnTo="/admin/evidence/" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </AdminPanel>
        <AdminPanel title="Existing verified claims">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Claim</th>
                <th>Edit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.flatMap((product) =>
                product.verifiedClaims.map((claim) => (
                  <tr key={claim.id}>
                    <td>{product.canonicalName}</td>
                    <td>
                      {claim.testType}: {claim.resultValue}
                    </td>
                    <td>
                      <VerifiedClaimForm
                        claim={claim}
                        labEvidenceAssets={labEvidenceAssets}
                        listId={`verified-claim-evidence-url-${claim.id}`}
                        products={products}
                      />
                    </td>
                    <td>
                      <RecordActionForm entityId={claim.id} entityType="verified-claim" returnTo="/admin/evidence/" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </AdminPanel>
        <AdminPanel title="Existing market risks">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Locale</th>
                <th>Risk</th>
                <th>Edit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.flatMap((product) =>
                product.marketRisks.map((risk) => (
                  <tr key={risk.id}>
                    <td>{product.canonicalName}</td>
                    <td>{risk.locale}</td>
                    <td>{risk.score}</td>
                    <td>
                      <MarketRiskForm products={products} risk={risk} />
                    </td>
                    <td>
                      <RecordActionForm entityId={risk.id} entityType="market-risk" returnTo="/admin/evidence/" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </AdminPanel>
      </div>
    );
  }

  if (section === "quality") {
    const duplicateCandidateCounts = await readDuplicateCandidateCounts();
    const rows = articles.map((article) => {
      const product = products.find((item) => item.id === article.productId);
      const evidencePack = evidencePacks.find((pack) => pack.productId === article.productId && pack.locale === article.locale);
      const result = runQualityGate({ article, product, evidencePack });
      const hreflangIssues = result.issues.filter((issue) => issue.code.startsWith("hreflang"));
      const schemaIssues = result.issues.filter((issue) => issue.code.startsWith("schema"));
      const affiliateIssues = result.issues.filter((issue) => issue.code.startsWith("affiliate"));
      const evidenceCount =
        article.evidenceIds.length + (product?.sellerClaims.length ?? 0) + (product?.verifiedClaims.length ?? 0);
      return {
        article,
        result,
        evidenceCount,
        hreflangIssues,
        schemaIssues,
        affiliateIssues,
        duplicateCandidateCount: article.productId ? duplicateCandidateCounts[article.productId] ?? 0 : 0
      };
    });
    const indexableRows = rows.filter(({ article }) => article.indexStatus === "index");
    const rowsWithErrors = rows.filter(
      ({ affiliateIssues, hreflangIssues, schemaIssues }) =>
        affiliateIssues.length > 0 || hreflangIssues.length > 0 || schemaIssues.length > 0
    );

    return (
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <QualityStat label="Indexed pages" value={indexableRows.length} />
          <QualityStat label="Avg internal links" value={average(rows.map(({ article }) => article.internalLinks.length)).toFixed(1)} />
          <QualityStat label="SEO issue rows" value={rowsWithErrors.length} />
          <QualityStat label="Duplicate candidates" value={rows.reduce((sum, row) => sum + row.duplicateCandidateCount, 0)} />
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
                  <td>{hreflangIssues.length ? hreflangIssues.map((issue) => issue.code).join(", ") : "-"}</td>
                  <td>{schemaIssues.length ? schemaIssues.map((issue) => issue.code).join(", ") : "-"}</td>
                  <td>{affiliateIssues.length ? affiliateIssues.map((issue) => issue.code).join(", ") : "-"}</td>
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
    const [report, persistedSuggestions] = await Promise.all([
      readSearchConsoleReport(),
      readPersistedRefreshSuggestions()
    ]);
    return (
      <div className="space-y-6">
        <AdminPanel title="Search performance rows">
          <table>
            <thead>
              <tr>
                <th>Page</th>
                <th>Query</th>
                <th>Country</th>
                <th>Device</th>
                <th>Clicks</th>
                <th>Impressions</th>
                <th>CTR</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {report.rows.map((row) => (
                <tr key={`${row.page}-${row.query}-${row.country}-${row.device}`}>
                  <td>{row.page}</td>
                  <td>{row.query}</td>
                  <td>{row.country ?? "-"}</td>
                  <td>{row.device ?? "-"}</td>
                  <td>{row.clicks}</td>
                  <td>{row.impressions}</td>
                  <td>{`${(row.ctr * 100).toFixed(2)}%`}</td>
                  <td>{row.position.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminPanel>
        <AdminPanel title="Refresh suggestions">
          {report.suggestions.length === 0 ? (
            <p className="text-sm text-neutral-700">No refresh suggestions have been exported yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Query</th>
                  <th>Priority</th>
                  <th>Missing section</th>
                  <th>Title/meta</th>
                  <th>Links</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {report.suggestions.map((suggestion) => (
                  <tr key={`${suggestion.page}-${suggestion.query}`}>
                    <td>{suggestion.page}</td>
                    <td>
                      <p>{suggestion.query ?? "-"}</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {[suggestion.country, suggestion.device, suggestion.reason].filter(Boolean).join(" / ") || "-"}
                      </p>
                    </td>
                    <td>
                      <p className="font-semibold">{suggestion.priority ?? 0}</p>
                      {suggestion.diagnostics?.section_match_score !== undefined ? (
                        <p className="mt-1 text-xs text-neutral-500">
                          section match {String(suggestion.diagnostics.section_match_score)}
                        </p>
                      ) : null}
                    </td>
                    <td>
                      {suggestion.missing_sections?.length ? (
                        <ul className="space-y-2">
                          {suggestion.missing_sections.map((section) => (
                            <li key={section.heading}>
                              <p className="font-semibold">{section.heading}</p>
                              {section.why ? <p className="mt-1 text-sm text-neutral-600">{section.why}</p> : null}
                              {section.recommended_details?.length ? (
                                <p className="mt-1 text-xs text-neutral-500">{section.recommended_details.join(" | ")}</p>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <p className="font-semibold">{suggestion.title_candidate ?? "-"}</p>
                      <p className="mt-1 text-sm text-neutral-600">{suggestion.meta_description_candidate ?? "-"}</p>
                    </td>
                    <td>
                      {suggestion.internal_link_candidates?.length ? (
                        <ul className="list-disc pl-5">
                          {suggestion.internal_link_candidates.slice(0, 3).map((candidate) => (
                            <li key={candidate.path}>
                              <span>{candidate.path}</span>
                              {candidate.anchor ? <span className="block text-xs text-neutral-500">anchor: {candidate.anchor}</span> : null}
                              {candidate.reason ? <span className="block text-xs text-neutral-500">{candidate.reason}</span> : null}
                              {candidate.score ? <span className="block text-xs text-neutral-500">score: {candidate.score}</span> : null}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <ul className="list-disc pl-5">
                        {suggestion.action.map((action) => (
                          <li key={action}>{action}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminPanel>
        <AdminPanel title="Persisted refresh workflow">
          {persistedSuggestions.length === 0 ? (
            <p className="text-sm text-neutral-700">
              No persisted refresh suggestions are available yet. Import the export into Postgres to track open, planned,
              applied, and dismissed states.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Page</th>
                  <th>Query</th>
                  <th>Reason/actions</th>
                  <th>Updated</th>
                  <th>Change status</th>
                </tr>
              </thead>
              <tbody>
                {persistedSuggestions.map((suggestion) => (
                  <tr key={suggestion.id}>
                    <td>
                      <p className="font-semibold">{suggestion.status}</p>
                      <p className="text-xs text-neutral-500">{suggestion.id}</p>
                    </td>
                    <td>{suggestion.page}</td>
                    <td>{suggestion.query ?? "-"}</td>
                    <td>
                      <p>{suggestion.reason}</p>
                      {suggestion.priority ? (
                        <p className="mt-1 text-xs font-semibold uppercase text-neutral-500">
                          priority {suggestion.priority}
                        </p>
                      ) : null}
                      {suggestion.titleCandidate ? (
                        <div className="mt-2 text-sm">
                          <p className="font-semibold">{suggestion.titleCandidate}</p>
                          {suggestion.metaDescriptionCandidate ? (
                            <p className="mt-1 text-neutral-600">{suggestion.metaDescriptionCandidate}</p>
                          ) : null}
                        </div>
                      ) : null}
                      {suggestion.missingSections.length ? (
                        <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700">
                          {suggestion.missingSections.slice(0, 2).map((section) => (
                            <li key={section.heading}>
                              <span className="font-semibold">{section.heading}</span>
                              {section.intent ? <span className="text-neutral-500"> ({section.intent})</span> : null}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {suggestion.internalLinkCandidates.length ? (
                        <p className="mt-2 text-xs text-neutral-500">
                          Links: {suggestion.internalLinkCandidates.slice(0, 3).map((candidate) => candidate.path).join(", ")}
                        </p>
                      ) : null}
                      {suggestion.actions.length ? (
                        <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700">
                          {suggestion.actions.slice(0, 3).map((action) => (
                            <li key={action}>{action}</li>
                          ))}
                        </ul>
                      ) : null}
                    </td>
                    <td>{suggestion.updatedAt}</td>
                    <td>
                      <RefreshSuggestionStatusForm suggestion={suggestion} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminPanel>
        <p className="text-sm text-neutral-700">
          Import rows with <code>python3 workers/python/cli.py import-search-console</code>, export suggestions with{" "}
          <code>python3 workers/python/cli.py suggest-refreshes</code>, then persist them with the DB admin commands when
          Postgres is available. Once persisted, mark each suggestion as planned, applied, or dismissed from this page.
        </p>
      </div>
    );
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
    const trendFilters = {
      locale: stringFromSearchParam(filters.locale),
      country: stringFromSearchParam(filters.country),
      source: stringFromSearchParam(filters.source)
    };
    const trends = await readTrendRows(trendFilters);
    return (
      <div className="space-y-8">
        <AdminPanel title="Import trend CSV">
          <QueuePublishingJobForm
            file="data/seeds/trend-signals.csv"
            jobType="import_trend_signals"
            locale={trendFilters.locale || "en"}
            returnTo="/admin/trends/"
          />
        </AdminPanel>
        <AdminPanel title="Trend filters">
          <form className="grid gap-2 md:grid-cols-4" method="get">
            <TextInput defaultValue={trendFilters.locale} label="Locale" name="locale" />
            <TextInput defaultValue={trendFilters.country} label="Country" name="country" />
            <TextInput defaultValue={trendFilters.source} label="Source" name="source" />
            <button className="rounded-md bg-neutral-800 px-3 py-2 text-sm font-semibold text-white" type="submit">Apply filters</button>
          </form>
        </AdminPanel>
        <AdminPanel title="Trend signals">
          {trends.length === 0 ? (
            <p className="text-sm text-neutral-700">No trend signals are available. Run <code>python3 workers/python/cli.py import-trend-signals</code> or connect Postgres.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Signal</th>
                  <th>Locale</th>
                  <th>Scores</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {trends.map((trend) => (
                  <tr key={trend.id}>
                    <td>
                      <p className="font-semibold">{trend.query}</p>
                      <p className="text-xs text-neutral-500">{trend.topicRaw}</p>
                    </td>
                    <td>{trend.locale}{trend.country ? `/${trend.country}` : ""}</td>
                    <td className="text-sm">
                      growth {trend.growthScore}, commercial {trend.commercialScore}, evidence {trend.evidenceFitScore}, affiliate {trend.affiliateFitScore}
                    </td>
                    <td>{trend.sourceName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminPanel>
      </div>
    );
  }

  if (section === "topics") {
    const topics = await readTopicRows();
    return (
      <AdminPanel title="Topics">
        {topics.length === 0 ? (
          <p className="text-sm text-neutral-700">No topics are available. Run the trend cluster and score commands first.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Topic</th>
                <th>Intent</th>
                <th>Score</th>
                <th>Breakdown</th>
                <th>Status</th>
                <th>Rows</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic) => (
                <tr key={topic.id}>
                  <td>
                    <p className="font-semibold">{topic.canonicalTopic}</p>
                    <p className="text-xs text-neutral-500">{topic.slug}</p>
                  </td>
                  <td>{topic.intent}{topic.healthSensitive ? " / health" : ""}</td>
                  <td>{topic.score.toFixed(1)}</td>
                  <td className="text-xs text-neutral-600">{scoreBreakdownSummary(topic.scoreBreakdown)}</td>
                  <td>{topic.status}</td>
                  <td className="text-sm">{topic.signalCount} signals, {topic.briefCount} briefs, {topic.offerCount} offers</td>
                  <td>
                    <div className="space-y-3">
                      {topic.dbBacked ? <TopicStatusForm topic={topic} /> : <span className="text-xs text-neutral-500">CSV export only</span>}
                      <QueuePublishingJobForm
                        jobType="generate_content_brief"
                        locale={topic.primaryLocale || "en"}
                        returnTo="/admin/topics/"
                        topicId={topic.id}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminPanel>
    );
  }

  if (section === "briefs") {
    const briefs = await readContentBriefRows();
    return (
      <AdminPanel title="Content briefs">
        {briefs.length === 0 ? (
          <p className="text-sm text-neutral-700">No content briefs are available. Run <code>python3 workers/python/cli.py generate-content-briefs</code>.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Brief</th>
                <th>Topic</th>
                <th>Intent</th>
                <th>Outline</th>
                <th>Evidence</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {briefs.map((brief) => (
                <tr key={brief.id}>
                  <td>
                    <p className="font-semibold">{brief.titleCandidate}</p>
                    <p className="text-xs text-neutral-500">{brief.locale}/{brief.articleType}</p>
                  </td>
                  <td>{brief.topicLabel}</td>
                  <td>{brief.searchIntent}</td>
                  <td className="text-xs text-neutral-600">{brief.outline.slice(0, 4).join(", ")}</td>
                  <td>{brief.requiredEvidence.slice(0, 3).join(", ")}</td>
                  <td>{brief.status}</td>
                  <td>
                    <div className="space-y-3">
                      {brief.dbBacked ? <ContentBriefStatusForm brief={brief} /> : <span className="text-xs text-neutral-500">JSON export only</span>}
                      <QueuePublishingJobForm
                        briefId={brief.id}
                        jobType="generate_topic_draft"
                        locale={brief.locale || "en"}
                        returnTo="/admin/briefs/"
                        topicId={brief.topicId}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminPanel>
    );
  }

  if (section === "publishing-jobs") {
    const jobs = await readPublishingJobRows();
    return (
      <AdminPanel title="Publishing jobs">
        {jobs.length === 0 ? (
          <p className="text-sm text-neutral-700">No publishing jobs are available. Generated JSON gate results are shown after <code>run-publishing-gate</code>.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Target</th>
                <th>Status</th>
                <th>Output</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <p className="font-semibold">{job.jobType}</p>
                    <p className="text-xs text-neutral-500">{job.locale}</p>
                  </td>
                  <td>{job.targetLabel}</td>
                  <td>{job.status}</td>
                  <td className="max-w-md text-sm text-neutral-700">{job.error || job.outputSummary || "-"}</td>
                  <td>{job.dbBacked && job.status !== "running" ? <PublishingJobRetryForm jobId={job.id} /> : <span className="text-xs text-neutral-500">read only</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminPanel>
    );
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
    const merchants = await readAffiliateMerchants();
    return (
      <div className="space-y-8">
        <AdminPanel title="Create or edit merchant">
          <MerchantForm />
        </AdminPanel>
        <AdminPanel title="Affiliate merchants">
          {merchants.length === 0 ? (
            <p className="text-sm text-neutral-700">No DB-backed merchants are available. Connect Postgres and run the seed to populate AliExpress and iHerb.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Merchant</th>
                  <th>Type</th>
                  <th>Allowed domains</th>
                  <th>Health</th>
                  <th>Status</th>
                  <th>Rows</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {merchants.map((merchant) => (
                  <tr key={merchant.id}>
                    <td>
                      <p className="font-semibold">{merchant.name}</p>
                      <p className="text-xs text-neutral-500">{merchant.slug}</p>
                    </td>
                    <td>{merchant.merchantType}</td>
                    <td>{merchant.allowedDomains.join(", ")}</td>
                    <td>{merchant.healthSensitive ? "health-sensitive" : "standard"}</td>
                    <td>{merchant.enabled ? "enabled" : "disabled"}</td>
                    <td>
                      <p>{merchant.offerCount} offers</p>
                      <p>{merchant.clickCount} clicks</p>
                    </td>
                    <td><MerchantForm merchant={merchant} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminPanel>
      </div>
    );
  }

  if (section === "offers") {
    const [offers, merchants] = await Promise.all([readAffiliateOffers(), readAffiliateMerchants()]);
    return (
      <div className="space-y-8">
        <AdminPanel title="Create or edit offer">
          <OfferForm merchants={merchants} />
        </AdminPanel>
        <AdminPanel title="Affiliate offers">
          {offers.length === 0 ? (
            <p className="text-sm text-neutral-700">No DB-backed offers are available. Connect Postgres and run the seed to create sample offer rows.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Offer</th>
                  <th>Merchant</th>
                  <th>Locale</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Placements</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id}>
                    <td>
                      <p className="font-semibold">{offer.title}</p>
                      <p className="max-w-md truncate text-xs text-neutral-500">{offer.affiliateUrl}</p>
                    </td>
                    <td>{offer.merchantSlug}</td>
                    <td>{offer.locale ?? "-"}</td>
                    <td>{offer.category}</td>
                    <td>{offer.status}</td>
                    <td>
                      <p>{offer.placementCount} placements</p>
                      <p>{offer.clickCount} clicks</p>
                    </td>
                    <td><OfferForm merchants={merchants} offer={offer} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminPanel>
      </div>
    );
  }

  if (section === "offer-matching") {
    const [candidates, placements] = await Promise.all([readAffiliatePlacementCandidates(), readAffiliatePlacements()]);
    return (
      <div className="space-y-8">
        <AdminPanel title="Offer matching candidates">
          {candidates.length === 0 ? (
            <p className="text-sm text-neutral-700">
              No placement candidate export is available. Run <code>python3 workers/python/cli.py match-affiliate-offers</code> to generate draft candidates.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Article</th>
                  <th>Merchant</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      <p className="font-semibold">{candidate.anchorText}</p>
                      <p className="text-xs text-neutral-500">{candidate.placementType}</p>
                    </td>
                    <td>
                      <p>{candidate.articleId || candidate.briefId}</p>
                      <p className="text-xs text-neutral-500">{candidate.topicId}</p>
                    </td>
                    <td>{candidate.merchantSlug}</td>
                    <td>{candidate.offerScore.toFixed(1)}</td>
                    <td>
                      <p>{candidate.status}</p>
                      <p className="text-xs text-neutral-500">{candidate.humanApprovalRequired ? "human approval required" : "not required"}</p>
                    </td>
                    <td className="max-w-md text-sm text-neutral-700">{candidate.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminPanel>
        <AdminPanel title="Approve or reject persisted placements">
          {placements.length === 0 ? (
            <p className="text-sm text-neutral-700">No DB-backed placements are available yet. Candidate exports stay draft-only until they are persisted to the database.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Placement</th>
                  <th>Offer</th>
                  <th>Status</th>
                  <th>Disclosure</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {placements.map((placement) => (
                  <tr key={placement.id}>
                    <td>
                      <p className="font-semibold">{placement.anchorText}</p>
                      <p className="text-xs text-neutral-500">{placement.articleLocale}/{placement.articleType}/{placement.articleSlug}</p>
                    </td>
                    <td>
                      <p>{placement.offerTitle}</p>
                      <p className="text-xs text-neutral-500">{placement.merchantSlug}</p>
                    </td>
                    <td>{placement.status}</td>
                    <td>{placement.disclosureShown ? "confirmed" : "missing"}</td>
                    <td>
                      <PlacementStatusForm placementId={placement.id} returnTo="/admin/offer-matching/" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminPanel>
      </div>
    );
  }

  if (section === "placements") {
    const placements = await readAffiliatePlacements();
    return (
      <AdminPanel title="Affiliate placements">
        {placements.length === 0 ? (
          <p className="text-sm text-neutral-700">No DB-backed placements are available. Connect Postgres and run the seed to approve sample article CTAs.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Placement</th>
                <th>Article</th>
                <th>Offer</th>
                <th>Status</th>
                <th>Disclosure</th>
                <th>Rel</th>
                <th>Clicks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {placements.map((placement) => (
                <tr key={placement.id}>
                  <td>
                    <p className="font-semibold">{placement.anchorText}</p>
                    <p className="text-xs text-neutral-500">{placement.placementType}</p>
                  </td>
                  <td>
                    <p>{placement.articleTitle}</p>
                    <p className="text-xs text-neutral-500">
                      {placement.articleLocale}/{placement.articleType}/{placement.articleSlug}
                    </p>
                  </td>
                  <td>
                    <p>{placement.offerTitle}</p>
                    <p className="text-xs text-neutral-500">{placement.merchantSlug}</p>
                  </td>
                  <td>{placement.status}</td>
                  <td>{placement.disclosureShown ? "confirmed" : "missing"}</td>
                  <td>{placement.rel}</td>
                  <td>{placement.clickCount}</td>
                  <td>
                    <PlacementStatusForm placementId={placement.id} returnTo="/admin/placements/" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminPanel>
    );
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

type AdminRecordEntityType =
  | "product"
  | "variant"
  | "seller-claim"
  | "verified-claim"
  | "market-risk"
  | "evidence-pack"
  | "article";

function RecordActionForm({
  entityId,
  entityType,
  returnTo
}: {
  entityId: string;
  entityType: AdminRecordEntityType;
  returnTo: string;
}) {
  return (
    <form action="/api/admin/record-action" className="grid min-w-52 gap-2" method="post">
      <input name="entityType" type="hidden" value={entityType} />
      <input name="entityId" type="hidden" value={entityId} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <input
        className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
        name="adminToken"
        placeholder="Admin token"
        type="password"
      />
      <div className="grid grid-cols-2 gap-2">
        <button className="rounded-md bg-neutral-700 px-3 py-2 text-sm font-semibold text-white" name="action" type="submit" value="archive">
          Archive
        </button>
        <button className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white" name="action" type="submit" value="delete">
          Delete
        </button>
      </div>
    </form>
  );
}

function RefreshSuggestionStatusForm({
  suggestion
}: {
  suggestion: Awaited<ReturnType<typeof readPersistedRefreshSuggestions>>[number];
}) {
  return (
    <form action="/api/admin/refresh-suggestion-status" className="grid min-w-56 gap-2" method="post">
      <input name="id" type="hidden" value={suggestion.id} />
      <input name="returnTo" type="hidden" value="/admin/search-console/" />
      <input
        className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
        name="adminToken"
        placeholder="Admin token"
        type="password"
      />
      <select
        className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
        defaultValue={suggestion.status}
        name="status"
      >
        {refreshSuggestionStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">
        Save status
      </button>
    </form>
  );
}

function PlacementStatusForm({ placementId, returnTo }: { placementId: string; returnTo: string }) {
  return (
    <form action="/api/admin/affiliate-placement-status" className="grid min-w-56 gap-2" method="post">
      <input name="id" type="hidden" value={placementId} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <input name="disclosureShown" type="hidden" value="true" />
      <input
        className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
        name="adminToken"
        placeholder="Admin token"
        type="password"
      />
      <div className="grid grid-cols-2 gap-2">
        <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" name="status" type="submit" value="approved">
          Approve
        </button>
        <button className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white" name="status" type="submit" value="rejected">
          Reject
        </button>
      </div>
    </form>
  );
}

function TopicStatusForm({ topic }: { topic: Awaited<ReturnType<typeof readTopicRows>>[number] }) {
  return (
    <form action="/api/admin/topic-status" className="grid min-w-52 gap-2" method="post">
      <input name="id" type="hidden" value={topic.id} />
      <input name="returnTo" type="hidden" value="/admin/topics/" />
      <input className="rounded-md border border-neutral-300 px-2 py-1 text-sm" name="adminToken" placeholder="Admin token" type="password" />
      <select className="rounded-md border border-neutral-300 px-2 py-1 text-sm" defaultValue={topic.status} name="status">
        {topicStatuses.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">Save</button>
    </form>
  );
}

function ContentBriefStatusForm({ brief }: { brief: Awaited<ReturnType<typeof readContentBriefRows>>[number] }) {
  return (
    <form action="/api/admin/content-brief-status" className="grid min-w-52 gap-2" method="post">
      <input name="id" type="hidden" value={brief.id} />
      <input name="returnTo" type="hidden" value="/admin/briefs/" />
      <input className="rounded-md border border-neutral-300 px-2 py-1 text-sm" name="adminToken" placeholder="Admin token" type="password" />
      <select className="rounded-md border border-neutral-300 px-2 py-1 text-sm" defaultValue={brief.status} name="status">
        {contentBriefStatuses.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">Save</button>
    </form>
  );
}

function PublishingJobRetryForm({ jobId }: { jobId: string }) {
  return (
    <form action="/api/admin/publishing-job-retry" className="grid min-w-48 gap-2" method="post">
      <input name="id" type="hidden" value={jobId} />
      <input name="returnTo" type="hidden" value="/admin/publishing-jobs/" />
      <input className="rounded-md border border-neutral-300 px-2 py-1 text-sm" name="adminToken" placeholder="Admin token" type="password" />
      <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">Retry</button>
    </form>
  );
}

function QueuePublishingJobForm({
  articleId,
  briefId,
  file,
  groupId,
  jobType,
  locale,
  returnTo,
  topicId
}: {
  articleId?: string;
  briefId?: string;
  file?: string;
  groupId?: string;
  jobType: string;
  locale: string;
  returnTo: string;
  topicId?: string;
}) {
  return (
    <form action="/api/admin/publishing-job" className="grid min-w-52 gap-2" method="post">
      <input name="articleId" type="hidden" value={articleId ?? ""} />
      <input name="briefId" type="hidden" value={briefId ?? ""} />
      <input name="file" type="hidden" value={file ?? ""} />
      <input name="groupId" type="hidden" value={groupId ?? ""} />
      <input name="jobType" type="hidden" value={jobType} />
      <input name="locale" type="hidden" value={locale} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <input name="topicId" type="hidden" value={topicId ?? ""} />
      <input className="rounded-md border border-neutral-300 px-2 py-1 text-sm" name="adminToken" placeholder="Admin token" type="password" />
      <button className="rounded-md bg-neutral-800 px-3 py-2 text-sm font-semibold text-white" type="submit">
        Queue {jobType.replaceAll("_", " ")}
      </button>
    </form>
  );
}

function MerchantForm({ merchant }: { merchant?: Awaited<ReturnType<typeof readAffiliateMerchants>>[number] }) {
  return (
    <form action="/api/admin/merchant" className="grid min-w-96 gap-2 md:grid-cols-2" method="post">
      <input name="id" type="hidden" value={merchant?.id ?? ""} />
      <input name="returnTo" type="hidden" value="/admin/merchants/" />
      <AdminTokenInput />
      <TextInput defaultValue={merchant?.name} label="Name" name="name" required />
      <TextInput defaultValue={merchant?.slug} label="Slug" name="slug" required />
      <TextInput defaultValue={merchant?.domain} label="Domain" name="domain" required />
      <TextInput defaultValue={merchant?.merchantType ?? "retailer"} label="Type" name="merchantType" required />
      <TextInput defaultValue={merchant?.allowedDomains.join(", ")} label="Allowed domains" name="allowedDomains" required />
      <TextInput defaultValue={merchant?.defaultRel ?? "sponsored nofollow"} label="Default rel" name="defaultRel" required />
      <label className="text-sm">
        <span className="block text-neutral-600">Health sensitive</span>
        <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={merchant?.healthSensitive ? "true" : "false"} name="healthSensitive">
          <option value="false">false</option>
          <option value="true">true</option>
        </select>
      </label>
      <label className="text-sm">
        <span className="block text-neutral-600">Enabled</span>
        <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={merchant?.enabled === false ? "false" : "true"} name="enabled">
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </label>
      <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white md:col-span-2" type="submit">
        Save merchant
      </button>
    </form>
  );
}

function OfferForm({
  merchants,
  offer
}: {
  merchants: Awaited<ReturnType<typeof readAffiliateMerchants>>;
  offer?: Awaited<ReturnType<typeof readAffiliateOffers>>[number];
}) {
  return (
    <form action="/api/admin/offer" className="grid min-w-96 gap-2 md:grid-cols-2" method="post">
      <input name="id" type="hidden" value={offer?.id ?? ""} />
      <input name="returnTo" type="hidden" value="/admin/offers/" />
      <AdminTokenInput />
      <label className="text-sm">
        <span className="block text-neutral-600">Merchant</span>
        <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={offer?.merchantId ?? ""} name="merchantId" required>
          <option value="">Select merchant</option>
          {merchants.map((merchant) => (
            <option key={merchant.id} value={merchant.id}>{merchant.slug}</option>
          ))}
        </select>
      </label>
      <TextInput defaultValue={offer?.title} label="Title" name="title" required />
      <TextInput defaultValue={offer?.category ?? "general"} label="Category" name="category" required />
      <TextInput defaultValue={offer?.url} label="URL" name="url" required />
      <TextInput defaultValue={offer?.affiliateUrl} label="Affiliate URL" name="affiliateUrl" required />
      <TextInput defaultValue={offer?.locale ?? ""} label="Locale" name="locale" />
      <TextInput defaultValue={offer?.country ?? ""} label="Country" name="country" />
      <TextInput defaultValue={offer?.price ?? ""} label="Price" name="price" type="number" />
      <TextInput defaultValue={offer?.currency ?? ""} label="Currency" name="currency" />
      <TextInput defaultValue={offer?.evidenceLevel ?? "merchant_claim"} label="Evidence level" name="evidenceLevel" />
      <TextInput defaultValue={offer?.status ?? "active"} label="Status" name="status" />
      <TextInput defaultValue={offer?.lastCheckedAt ?? ""} label="Last checked" name="lastCheckedAt" type="date" />
      <label className="text-sm">
        <span className="block text-neutral-600">Health sensitive</span>
        <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={offer?.healthSensitive ? "true" : "false"} name="healthSensitive">
          <option value="false">false</option>
          <option value="true">true</option>
        </select>
      </label>
      <label className="text-sm md:col-span-2">
        <span className="block text-neutral-600">Description</span>
        <textarea className="mt-1 min-h-20 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={offer?.description ?? ""} name="description" />
      </label>
      <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white md:col-span-2" type="submit">
        Save offer
      </button>
    </form>
  );
}

function AdminPanel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function QualityStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-neutral-200 p-3">
      <p className="text-xs uppercase text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function AdminTokenInput() {
  return (
    <label className="text-sm">
      <span className="block text-neutral-600">Admin token</span>
      <input className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" name="adminToken" type="password" />
    </label>
  );
}

function TextInput({
  defaultValue,
  label,
  name,
  required = false,
  type = "text"
}: {
  defaultValue?: string | number;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  const inputProps = {
    ...(required ? { required: true } : {}),
    ...(type === "number" ? { step: "any" } : {})
  };

  return (
    <label className="text-sm">
      <span className="block text-neutral-600">{label}</span>
      <input
        className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1"
        defaultValue={fieldValue(defaultValue)}
        name={name}
        type={type}
        {...inputProps}
      />
    </label>
  );
}

function ProductSelect({ defaultValue, products }: { defaultValue?: string; products: Awaited<ReturnType<typeof getAllProducts>> }) {
  return (
    <label className="text-sm">
      <span className="block text-neutral-600">Product</span>
      <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={fieldValue(defaultValue)} name="productId" required>
        <option value="">Select product</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.canonicalName}
          </option>
        ))}
      </select>
    </label>
  );
}

function SaveButton({ label = "Save" }: { label?: string }) {
  return (
    <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">
      {label}
    </button>
  );
}

function ProductForm({ product }: { product?: Awaited<ReturnType<typeof getAllProducts>>[number] }) {
  return (
    <form action="/api/admin/evidence-record" className="grid min-w-96 gap-2 md:grid-cols-2" method="post">
      <input name="recordType" type="hidden" value="product" />
      <input name="returnTo" type="hidden" value="/admin/products/" />
      {product ? <input name="id" type="hidden" value={product.id} /> : null}
      <AdminTokenInput />
      <TextInput defaultValue={product?.canonicalName} label="Name" name="canonicalName" required />
      <TextInput defaultValue={product?.slug} label="Slug" name="slug" required />
      <TextInput defaultValue={product?.category} label="Category" name="category" required />
      <TextInput defaultValue={product?.brandClaim} label="Brand claim" name="brandClaim" />
      <TextInput defaultValue={product?.identityConfidence} label="Identity confidence" name="identityConfidence" type="number" />
      <TextInput defaultValue={product?.imageHash} label="Image hash" name="imageHash" />
      <SaveButton label={product ? "Update product" : "Create product"} />
    </form>
  );
}

function VariantForm({
  productId,
  variant
}: {
  productId: string;
  variant?: Awaited<ReturnType<typeof getAllProducts>>[number]["variants"][number];
}) {
  return (
    <form action="/api/admin/evidence-record" className="grid min-w-96 gap-2 md:grid-cols-2" method="post">
      <input name="recordType" type="hidden" value="variant" />
      <input name="returnTo" type="hidden" value="/admin/products/" />
      <input name="productId" type="hidden" value={productId} />
      {variant ? <input name="id" type="hidden" value={variant.id} /> : null}
      <AdminTokenInput />
      <TextInput defaultValue={variant?.optionName} label="Option" name="optionName" required />
      <TextInput defaultValue={variant?.sourceUrl} label="Source URL" name="sourceUrl" required />
      <TextInput defaultValue={variant?.sourceSku} label="Source SKU" name="sourceSku" />
      <TextInput defaultValue={variant?.wattageClaim} label="Wattage" name="wattageClaim" type="number" />
      <TextInput defaultValue={variant?.plugType} label="Plug" name="plugType" />
      <TextInput defaultValue={variant?.cableIncluded === undefined ? "" : String(variant.cableIncluded)} label="Cable included" name="cableIncluded" />
      <TextInput defaultValue={variant?.affiliateUrl} label="Affiliate URL" name="affiliateUrl" />
      <TextInput defaultValue={variant?.sellerName} label="Seller" name="sellerName" />
      <TextInput defaultValue={variant?.sellerId} label="Seller ID" name="sellerId" />
      <label className="text-sm md:col-span-2">
        <span className="block text-neutral-600">Risk flags</span>
        <textarea
          className="mt-1 min-h-20 w-full rounded-md border border-neutral-300 px-2 py-1"
          defaultValue={(variant?.riskFlags ?? []).join("\n")}
          name="riskFlags"
        />
      </label>
      <SaveButton label={variant ? "Update variant" : "Add variant"} />
    </form>
  );
}

function SellerClaimForm({
  claim,
  products
}: {
  claim?: Awaited<ReturnType<typeof getAllProducts>>[number]["sellerClaims"][number];
  products: Awaited<ReturnType<typeof getAllProducts>>;
}) {
  return (
    <form action="/api/admin/evidence-record" className="grid min-w-96 gap-2 md:grid-cols-2" method="post">
      <input name="recordType" type="hidden" value="seller-claim" />
      <input name="returnTo" type="hidden" value="/admin/evidence/" />
      {claim ? <input name="id" type="hidden" value={claim.id} /> : null}
      <AdminTokenInput />
      <ProductSelect defaultValue={claim?.productId} products={products} />
      <TextInput defaultValue={claim?.claimType} label="Claim type" name="claimType" required />
      <TextInput defaultValue={claim?.claimValue} label="Claim value" name="claimValue" required />
      <TextInput defaultValue={claim?.confidence} label="Confidence" name="confidence" type="number" />
      <TextInput defaultValue={claim?.sourceUrl} label="Source URL" name="sourceUrl" />
      <label className="text-sm md:col-span-2">
        <span className="block text-neutral-600">Raw text</span>
        <textarea className="mt-1 min-h-20 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={fieldValue(claim?.rawText)} name="rawText" />
      </label>
      <SaveButton label={claim ? "Update seller claim" : "Add seller claim"} />
    </form>
  );
}

function VerifiedClaimForm({
  claim,
  labEvidenceAssets,
  listId,
  products
}: {
  claim?: Awaited<ReturnType<typeof getAllProducts>>[number]["verifiedClaims"][number];
  labEvidenceAssets: Awaited<ReturnType<typeof readLabEvidenceAssets>>;
  listId: string;
  products: Awaited<ReturnType<typeof getAllProducts>>;
}) {
  return (
    <form action="/api/admin/evidence-record" className="grid min-w-96 gap-2 md:grid-cols-2" method="post">
      <input name="recordType" type="hidden" value="verified-claim" />
      <input name="returnTo" type="hidden" value="/admin/evidence/" />
      {claim ? <input name="id" type="hidden" value={claim.id} /> : null}
      <AdminTokenInput />
      <ProductSelect defaultValue={claim?.productId} products={products} />
      <TextInput defaultValue={claim?.testType} label="Test type" name="testType" required />
      <TextInput defaultValue={claim?.resultValue} label="Result" name="resultValue" required />
      <TextInput defaultValue={claim?.unit} label="Unit" name="unit" />
      <TextInput defaultValue={claim?.confidence} label="Confidence" name="confidence" type="number" />
      <EvidenceUrlInput defaultValue={claim?.evidenceUrl} labEvidenceAssets={labEvidenceAssets} listId={listId} />
      <TextInput defaultValue={claim?.testedAt} label="Tested at" name="testedAt" type="date" />
      <label className="text-sm md:col-span-2">
        <span className="block text-neutral-600">Method</span>
        <textarea className="mt-1 min-h-20 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={fieldValue(claim?.method)} name="method" required />
      </label>
      <SaveButton label={claim ? "Update verified claim" : "Add verified claim"} />
    </form>
  );
}

function EvidenceUrlInput({
  defaultValue,
  labEvidenceAssets,
  listId
}: {
  defaultValue?: string;
  labEvidenceAssets: Awaited<ReturnType<typeof readLabEvidenceAssets>>;
  listId: string;
}) {
  return (
    <label className="text-sm">
      <span className="block text-neutral-600">Evidence URL</span>
      <input
        className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1"
        defaultValue={fieldValue(defaultValue)}
        list={listId}
        name="evidenceUrl"
      />
      <datalist id={listId}>
        {labEvidenceAssets.map((asset) => (
          <option key={asset.id} value={asset.publicUrl}>
            {asset.fileName} - {asset.measurementType}
          </option>
        ))}
      </datalist>
    </label>
  );
}

function MarketRiskForm({
  products,
  risk
}: {
  products: Awaited<ReturnType<typeof getAllProducts>>;
  risk?: Awaited<ReturnType<typeof getAllProducts>>[number]["marketRisks"][number];
}) {
  return (
    <form action="/api/admin/evidence-record" className="grid min-w-96 gap-2 md:grid-cols-2" method="post">
      <input name="recordType" type="hidden" value="market-risk" />
      <input name="returnTo" type="hidden" value="/admin/evidence/" />
      {risk ? <input name="id" type="hidden" value={risk.id} /> : null}
      <AdminTokenInput />
      <ProductSelect defaultValue={risk?.productId} products={products} />
      <label className="text-sm">
        <span className="block text-neutral-600">Locale</span>
        <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={fieldValue(risk?.locale)} name="locale" required>
          <option value="">Select locale</option>
          {locales.map((locale) => (
            <option key={locale} value={locale}>
              {locale}
            </option>
          ))}
        </select>
      </label>
      <TextInput defaultValue={risk?.country} label="Country" name="country" />
      <TextInput defaultValue={risk?.plugRisk} label="Plug risk" name="plugRisk" />
      <TextInput defaultValue={risk?.customsRisk} label="Customs risk" name="customsRisk" />
      <TextInput defaultValue={risk?.certificationRisk} label="Certification risk" name="certificationRisk" />
      <TextInput defaultValue={risk?.returnRisk} label="Return risk" name="returnRisk" />
      <TextInput defaultValue={risk?.score} label="Score" name="score" type="number" />
      <label className="text-sm md:col-span-2">
        <span className="block text-neutral-600">Local alternative note</span>
        <textarea
          className="mt-1 min-h-20 w-full rounded-md border border-neutral-300 px-2 py-1"
          defaultValue={fieldValue(risk?.localAlternativeNote)}
          name="localAlternativeNote"
        />
      </label>
      <SaveButton label={risk ? "Update market risk" : "Add market risk"} />
    </form>
  );
}

function EvidencePackForm({
  pack,
  products
}: {
  pack?: Awaited<ReturnType<typeof getAllEvidencePacks>>[number];
  products: Awaited<ReturnType<typeof getAllProducts>>;
}) {
  return (
    <form action="/api/admin/evidence-record" className="grid min-w-96 gap-2 md:grid-cols-2" method="post">
      <input name="recordType" type="hidden" value="evidence-pack" />
      <input name="returnTo" type="hidden" value="/admin/evidence/" />
      {pack ? <input name="id" type="hidden" value={pack.id} /> : null}
      <AdminTokenInput />
      <ProductSelect defaultValue={pack?.productId} products={products} />
      <label className="text-sm">
        <span className="block text-neutral-600">Locale</span>
        <select className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-1" defaultValue={fieldValue(pack?.locale)} name="locale" required>
          <option value="">Select locale</option>
          {locales.map((locale) => (
            <option key={locale} value={locale}>
              {locale}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm md:col-span-2">
        <span className="block text-neutral-600">Pack JSON</span>
        <textarea
          className="mt-1 min-h-48 w-full rounded-md border border-neutral-300 px-2 py-1 font-mono text-xs"
          defaultValue={JSON.stringify(pack?.packJson ?? emptyPackJson(), null, 2)}
          name="packJson"
          required
        />
      </label>
      <SaveButton label={pack ? "Update evidence pack" : "Create evidence pack"} />
    </form>
  );
}

function emptyPackJson() {
  return {
    variants: [],
    sellerClaims: [],
    verifiedClaims: [],
    reviewSignals: [],
    priceSnapshots: [],
    marketRisks: [],
    allowedClaims: [],
    forbiddenClaims: []
  };
}

function fieldValue(value: string | number | undefined) {
  return value ?? "";
}
