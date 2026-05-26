import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { readSearchConsoleReport } from "@/lib/admin/search-console-report";
import type { SearchConsoleInternalLinkCandidate, SearchConsoleMissingSection } from "@/lib/admin/search-console-report";
import { getAllArticles, getAllEvidencePacks, getAllProducts } from "@/lib/content/repository";
import { runQualityGate } from "@global-import-lab/validators";

const sections = [
  "products",
  "articles",
  "evidence",
  "quality",
  "search-console",
  "audit",
  "trends",
  "topics",
  "briefs",
  "merchants",
  "offers",
  "placements",
  "offer-matching",
  "publishing-jobs",
  "compliance",
  "localization"
] as const;
const indexStatuses = ["index", "noindex", "pending", "refresh_needed", "merge_candidate"];
const publishStatuses = ["draft", "pending", "published"];
const refreshSuggestionStatuses = ["open", "planned", "applied", "dismissed"];
const topicStatuses = ["candidate", "briefed", "drafted", "published", "rejected"];
const contentBriefStatuses = ["draft", "approved", "rejected", "converted"];
const locales = ["en", "es", "pt-br"];

interface AffiliatePlacementCandidateRow {
  id: string;
  topicId: string;
  briefId: string;
  articleId: string;
  offerId: string;
  merchantSlug: string;
  placementType: string;
  anchorText: string;
  rel: string;
  disclosureShown: boolean;
  status: string;
  humanApprovalRequired: boolean;
  offerScore: number;
  reason: string;
  scoreBreakdown: Record<string, number>;
}

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ section: string }>;
}

export function generateStaticParams() {
  return sections.map((section) => ({ section }));
}

export default async function AdminSectionPage({ params }: PageProps) {
  const { section } = await params;
  if (!sections.includes(section as (typeof sections)[number])) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-4xl font-semibold">Admin: {section}</h1>
        <div className="mt-6 rounded-md border border-neutral-200 bg-white p-4">
          <AdminTable section={section} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

async function AdminTable({ section }: { section: string }) {
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
    const trends = await readTrendRows();
    return (
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
                  <td>{topic.status}</td>
                  <td className="text-sm">{topic.signalCount} signals, {topic.briefCount} briefs, {topic.offerCount} offers</td>
                  <td>{topic.dbBacked ? <TopicStatusForm topic={topic} /> : <span className="text-xs text-neutral-500">CSV export only</span>}</td>
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
                  <td>{brief.requiredEvidence.slice(0, 3).join(", ")}</td>
                  <td>{brief.status}</td>
                  <td>{brief.dbBacked ? <ContentBriefStatusForm brief={brief} /> : <span className="text-xs text-neutral-500">JSON export only</span>}</td>
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
    const rows = await readComplianceRows(articles);
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

async function readPersistedRefreshSuggestions() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { listRefreshSuggestions } = await import("@global-import-lab/db/search-console");
    const rows = await listRefreshSuggestions({ limit: 100 });
    return rows.map((row) => ({
      ...normalizePersistedRefreshSuggestion(row)
    }));
  } catch (error) {
    console.warn("Persisted refresh suggestions unavailable.", error);
    return [];
  }
}

function normalizePersistedRefreshSuggestion(row: {
  id: string;
  page: string;
  query: string | null;
  reason: string;
  actions: unknown;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  const payload = normalizeRefreshSuggestionPayload(row.actions);
  return {
    id: row.id,
    page: row.page,
    query: row.query,
    reason: row.reason,
    actions: payload.actions,
    priority: payload.priority,
    titleCandidate: payload.titleCandidate,
    metaDescriptionCandidate: payload.metaDescriptionCandidate,
    missingSections: payload.missingSections,
    internalLinkCandidates: payload.internalLinkCandidates,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  };
}

async function readDuplicateCandidateCounts() {
  const path = join(findProjectRoot(), "data/snapshots/product_identity_graph.json");
  if (!existsSync(path)) {
    return {} as Record<string, number>;
  }

  try {
    const rows = JSON.parse(await readFile(path, "utf-8")) as unknown[];
    const counts: Record<string, number> = {};
    for (const row of rows) {
      if (!isRecord(row)) {
        continue;
      }
      const canonicalProduct = isRecord(row.canonical_product) ? row.canonical_product : {};
      const productIds = new Set<string>();
      const canonicalProductId = stringFromUnknown(canonicalProduct.product_id);
      if (canonicalProductId) {
        productIds.add(canonicalProductId);
      }
      if (Array.isArray(row.source_product_ids)) {
        for (const productId of row.source_product_ids) {
          const value = stringFromUnknown(productId);
          if (value) {
            productIds.add(value);
          }
        }
      }

      const candidates = Array.isArray(row.duplicate_candidates) ? row.duplicate_candidates : [];
      const actionableCount = candidates.filter((candidate) => {
        if (!isRecord(candidate)) {
          return false;
        }
        const decision = stringFromUnknown(candidate.decision);
        const confidence = numberFromUnknown(candidate.confidence);
        return decision !== "keep_separate" || confidence >= 0.5;
      }).length;

      for (const productId of productIds) {
        counts[productId] = actionableCount;
      }
    }
    return counts;
  } catch (error) {
    console.warn("Product identity graph unavailable.", error);
    return {} as Record<string, number>;
  }
}

async function readAuditLogs() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { getAuditLogs } = await import("@global-import-lab/db/admin-mutations");
    const logs = await getAuditLogs(50);
    return logs.map((log) => ({
      id: log.id,
      entityType: log.entityType,
      entityId: log.entityId,
      action: log.action,
      actor: log.actor,
      summary: log.summary,
      createdAt: log.createdAt.toISOString()
    }));
  } catch (error) {
    console.warn("Audit logs unavailable.", error);
    return [];
  }
}

async function readTrendRows() {
  if (process.env.DATABASE_URL) {
    try {
      const operations = await import("@global-import-lab/db/operations-admin");
      const rows = await operations.listTrendSignals();
      return rows.map((row) => ({
        id: row.id,
        locale: row.locale,
        country: row.country,
        query: row.query,
        topicRaw: row.topicRaw,
        growthScore: row.growthScore,
        commercialScore: row.commercialScore,
        evidenceFitScore: row.evidenceFitScore,
        affiliateFitScore: row.affiliateFitScore,
        sourceName: row.source.name
      }));
    } catch (error) {
      console.warn("Trend signals unavailable.", error);
    }
  }

  const payload = await readAdminJson("data/snapshots/trend_signals.json");
  const signals = isRecord(payload) && Array.isArray(payload.signals) ? payload.signals : [];
  return signals.flatMap((row) => {
    if (!isRecord(row)) {
      return [];
    }
    return [
      {
        id: stringFromUnknown(row.id),
        locale: stringFromUnknown(row.locale),
        country: stringFromUnknown(row.country),
        query: stringFromUnknown(row.query),
        topicRaw: stringFromUnknown(row.topicRaw),
        growthScore: numberFromUnknown(row.growthScore),
        commercialScore: numberFromUnknown(row.commercialScore),
        evidenceFitScore: numberFromUnknown(row.evidenceFitScore),
        affiliateFitScore: numberFromUnknown(row.affiliateFitScore),
        sourceName: stringFromUnknown(row.sourceId) || "manual_csv"
      }
    ];
  });
}

async function readTopicRows() {
  if (process.env.DATABASE_URL) {
    try {
      const operations = await import("@global-import-lab/db/operations-admin");
      const rows = await operations.listTopics();
      return rows.map((row) => ({
        id: row.id,
        canonicalTopic: row.canonicalTopic,
        slug: row.slug,
        intent: row.intent,
        healthSensitive: row.healthSensitive,
        status: row.status,
        score: row.score,
        signalCount: row._count.topicSignals,
        briefCount: row._count.contentBriefs,
        offerCount: row._count.offers,
        dbBacked: true
      }));
    } catch (error) {
      console.warn("Topics unavailable.", error);
    }
  }

  const payload = await readAdminJson("data/snapshots/topic_scores.json");
  const topics = isRecord(payload) && Array.isArray(payload.topics) ? payload.topics : [];
  return topics.flatMap((row) => {
    if (!isRecord(row)) {
      return [];
    }
    return [
      {
        id: stringFromUnknown(row.id),
        canonicalTopic: stringFromUnknown(row.canonicalTopic),
        slug: stringFromUnknown(row.slug),
        intent: stringFromUnknown(row.intent),
        healthSensitive: row.healthSensitive === true,
        status: stringFromUnknown(row.status) || "candidate",
        score: numberFromUnknown(row.score),
        signalCount: numberFromUnknown(row.signalCount),
        briefCount: 0,
        offerCount: 0,
        dbBacked: false
      }
    ];
  });
}

async function readContentBriefRows() {
  if (process.env.DATABASE_URL) {
    try {
      const operations = await import("@global-import-lab/db/operations-admin");
      const rows = await operations.listContentBriefs();
      return rows.map((row) => ({
        id: row.id,
        topicId: row.topicId,
        topicLabel: row.topic.canonicalTopic,
        locale: row.locale,
        articleType: row.articleType,
        titleCandidate: row.titleCandidate,
        searchIntent: row.searchIntent,
        requiredEvidence: stringArrayFromUnknown(row.requiredEvidence),
        status: row.status,
        dbBacked: true
      }));
    } catch (error) {
      console.warn("Content briefs unavailable.", error);
    }
  }

  const payload = await readAdminJson("data/briefs/content_briefs.json");
  const briefs = isRecord(payload) && Array.isArray(payload.briefs) ? payload.briefs : [];
  return briefs.flatMap((row) => {
    if (!isRecord(row)) {
      return [];
    }
    return [
      {
        id: stringFromUnknown(row.id),
        topicId: stringFromUnknown(row.topicId),
        topicLabel: stringFromUnknown(row.topicId),
        locale: stringFromUnknown(row.locale),
        articleType: stringFromUnknown(row.articleType),
        titleCandidate: stringFromUnknown(row.titleCandidate),
        searchIntent: stringFromUnknown(row.searchIntent),
        requiredEvidence: stringArrayFromUnknown(row.requiredEvidence),
        status: stringFromUnknown(row.status) || "draft",
        dbBacked: false
      }
    ];
  });
}

async function readPublishingJobRows() {
  if (process.env.DATABASE_URL) {
    try {
      const operations = await import("@global-import-lab/db/operations-admin");
      const rows = await operations.listPublishingJobs();
      return rows.map((row) => ({
        id: row.id,
        locale: row.locale,
        jobType: row.jobType,
        status: row.status,
        targetLabel: row.article?.title ?? row.topic?.canonicalTopic ?? row.articleId ?? row.topicId ?? "-",
        outputSummary: summarizeJson(row.outputJson),
        error: row.error,
        dbBacked: true
      }));
    } catch (error) {
      console.warn("Publishing jobs unavailable.", error);
    }
  }

  const payload = await readAdminJson("data/exports/topic_publishing_gate.json");
  const results = isRecord(payload) && Array.isArray(payload.results) ? payload.results : [];
  return results.flatMap((row) => {
    if (!isRecord(row)) {
      return [];
    }
    const blockers = stringArrayFromUnknown(row.blockers);
    return [
      {
        id: stringFromUnknown(row.articleId),
        locale: stringFromUnknown(row.locale),
        jobType: "publishing-gate",
        status: stringFromUnknown(row.status),
        targetLabel: stringFromUnknown(row.articleId),
        outputSummary: blockers.length ? blockers.join(", ") : "ready for manual review",
        error: "",
        dbBacked: false
      }
    ];
  });
}

async function readComplianceRows(sampleArticles: Awaited<ReturnType<typeof getAllArticles>>) {
  if (process.env.DATABASE_URL) {
    try {
      const operations = await import("@global-import-lab/db/operations-admin");
      const rows = await operations.listComplianceArticles();
      return rows.map((row) => ({
        id: row.id,
        title: row.title,
        locale: row.locale,
        type: row.type,
        slug: row.slug,
        publishStatus: row.publishStatus,
        indexStatus: row.indexStatus,
        healthSensitivity: row.healthSensitivity,
        complianceStatus: row.complianceStatus,
        issues: complianceIssuesFromJson(row.complianceJson)
      }));
    } catch (error) {
      console.warn("Compliance rows unavailable.", error);
    }
  }

  const gatePayload = await readAdminJson("data/exports/topic_publishing_gate.json");
  const gateRows = isRecord(gatePayload) && Array.isArray(gatePayload.results) ? gatePayload.results : [];
  const generatedRows = gateRows.flatMap((row) => {
    if (!isRecord(row)) {
      return [];
    }
    const blockers = stringArrayFromUnknown(row.blockers);
    if (blockers.length === 0) {
      return [];
    }
    return [
      {
        id: stringFromUnknown(row.articleId),
        title: stringFromUnknown(row.articleId),
        locale: stringFromUnknown(row.locale),
        type: stringFromUnknown(row.type),
        slug: stringFromUnknown(row.articleId),
        publishStatus: stringFromUnknown(row.publishStatus),
        indexStatus: stringFromUnknown(row.indexStatus),
        healthSensitivity: "",
        complianceStatus: stringFromUnknown(row.status),
        issues: blockers
      }
    ];
  });

  const sampleRows = sampleArticles
    .filter((article) => article.healthSensitivity !== "none" || article.complianceStatus !== "passed")
    .slice(0, 40)
    .map((article) => ({
      id: article.id,
      title: article.title,
      locale: article.locale,
      type: article.type,
      slug: article.slug,
      publishStatus: article.publishStatus,
      indexStatus: article.indexStatus,
      healthSensitivity: article.healthSensitivity ?? "none",
      complianceStatus: article.complianceStatus ?? "unchecked",
      issues: complianceIssuesFromJson(article.complianceJson)
    }));

  return [...generatedRows, ...sampleRows];
}

async function readLocalizationRows() {
  if (process.env.DATABASE_URL) {
    try {
      const operations = await import("@global-import-lab/db/operations-admin");
      const rows = await operations.listLocalizationGroups();
      return rows.map((row) => ({
        id: row.id,
        topicLabel: row.canonicalTopic?.canonicalTopic ?? "translation group",
        sourceLabel: row.sourceArticle ? `${row.sourceArticle.locale}/${row.sourceArticle.type}/${row.sourceArticle.slug}` : "-",
        variants: row.variants.map((variant) => ({
          locale: variant.locale,
          status: variant.status,
          localizationDepthScore: variant.localizationDepthScore
        }))
      }));
    } catch (error) {
      console.warn("Localization groups unavailable.", error);
    }
  }

  const payload = await readAdminJson("data/exports/localized_topic_articles.json");
  const articles = isRecord(payload) && Array.isArray(payload.articles) ? payload.articles : [];
  return articles.flatMap((row) => {
    if (!isRecord(row)) {
      return [];
    }
    const sourceArticleId = stringFromUnknown(row.sourceArticleId);
    return [
      {
        id: sourceArticleId || stringFromUnknown(row.id),
        topicLabel: stringFromUnknown(row.topicId) || "localized draft",
        sourceLabel: sourceArticleId,
        variants: [
          {
            locale: stringFromUnknown(row.locale),
            status: stringFromUnknown(row.translationStatus) || stringFromUnknown(row.publishStatus),
            localizationDepthScore: numberFromUnknown(row.localizationDepthScore)
          }
        ]
      }
    ];
  });
}

async function readAffiliateMerchants() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { listAffiliateMerchants } = await import("@global-import-lab/db/affiliate-clicks");
    const rows = await listAffiliateMerchants();
    return rows.map((merchant) => ({
      id: merchant.id,
      name: merchant.name,
      slug: merchant.slug,
      domain: merchant.domain,
      merchantType: merchant.merchantType,
      allowedDomains: stringArrayFromUnknown(merchant.allowedDomains),
      defaultRel: merchant.defaultRel,
      healthSensitive: merchant.healthSensitive,
      enabled: merchant.enabled,
      offerCount: merchant._count.offers,
      clickCount: merchant._count.affiliateClicks
    }));
  } catch (error) {
    console.warn("Affiliate merchants unavailable.", error);
    return [];
  }
}

async function readAffiliateOffers() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { listAffiliateOffers } = await import("@global-import-lab/db/affiliate-clicks");
    const rows = await listAffiliateOffers();
    return rows.map((offer) => ({
      id: offer.id,
      merchantId: offer.merchantId,
      programId: offer.programId,
      productId: offer.productId,
      topicId: offer.topicId,
      title: offer.title,
      description: offer.description,
      url: offer.url,
      affiliateUrl: offer.affiliateUrl,
      merchantSlug: offer.merchant.slug,
      locale: offer.locale,
      country: offer.country,
      category: offer.category,
      evidenceLevel: offer.evidenceLevel,
      healthSensitive: offer.healthSensitive,
      price: offer.price === null ? undefined : String(offer.price),
      currency: offer.currency,
      lastCheckedAt: offer.lastCheckedAt?.toISOString().slice(0, 10),
      status: offer.status,
      placementCount: offer._count.affiliatePlacements,
      clickCount: offer._count.affiliateClicks
    }));
  } catch (error) {
    console.warn("Affiliate offers unavailable.", error);
    return [];
  }
}

async function readAffiliatePlacements() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { listAffiliatePlacements } = await import("@global-import-lab/db/affiliate-clicks");
    const rows = await listAffiliatePlacements();
    return rows.map((placement) => ({
      id: placement.id,
      placementType: placement.placementType,
      anchorText: placement.anchorText,
      status: placement.status,
      rel: placement.rel,
      disclosureShown: placement.disclosureShown,
      articleTitle: placement.article.title,
      articleLocale: placement.article.locale,
      articleType: placement.article.type,
      articleSlug: placement.article.slug,
      offerTitle: placement.offer.title,
      merchantSlug: placement.offer.merchant.slug,
      clickCount: placement._count.affiliateClicks
    }));
  } catch (error) {
    console.warn("Affiliate placements unavailable.", error);
    return [];
  }
}

async function readAffiliatePlacementCandidates(): Promise<AffiliatePlacementCandidateRow[]> {
  try {
    const root = findProjectRoot();
    const path = join(root, "data", "exports", "affiliate_placement_candidates.json");
    if (!existsSync(path)) {
      return [];
    }
    const payload: unknown = JSON.parse(await readFile(path, "utf8"));
    const rows: unknown[] = isRecord(payload) && Array.isArray(payload.placementCandidates) ? payload.placementCandidates : [];
    return rows.flatMap((row) => {
      if (!isRecord(row)) {
        return [];
      }
      const id = stringFromUnknown(row.id);
      if (!id) {
        return [];
      }
      return [
        {
          id,
          topicId: stringFromUnknown(row.topicId),
          briefId: stringFromUnknown(row.briefId),
          articleId: stringFromUnknown(row.articleId),
          offerId: stringFromUnknown(row.offerId),
          merchantSlug: stringFromUnknown(row.merchantSlug),
          placementType: stringFromUnknown(row.placementType),
          anchorText: stringFromUnknown(row.anchorText),
          rel: stringFromUnknown(row.rel),
          disclosureShown: row.disclosureShown === true,
          status: stringFromUnknown(row.status),
          humanApprovalRequired: row.humanApprovalRequired !== false,
          offerScore: numberFromUnknown(row.offerScore),
          reason: stringFromUnknown(row.reason),
          scoreBreakdown: isRecord(row.scoreBreakdown)
            ? Object.fromEntries(Object.entries(row.scoreBreakdown).map(([key, value]) => [key, numberFromUnknown(value)]))
            : {}
        }
      ];
    });
  } catch (error) {
    console.warn("Affiliate placement candidates unavailable.", error);
    return [];
  }
}

async function readLabEvidenceAssets() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { listLabEvidenceAssets } = await import("@global-import-lab/db/lab-evidence");
    const assets = await listLabEvidenceAssets();
    return assets.map((asset) => ({
      id: asset.id,
      productId: asset.productId,
      verifiedClaimId: asset.verifiedClaimId,
      measurementType: asset.measurementType,
      fileName: asset.fileName,
      publicUrl: asset.publicUrl,
      sizeBytes: asset.sizeBytes,
      uploadedAt: asset.uploadedAt.toISOString()
    }));
  } catch (error) {
    console.warn("Lab evidence assets unavailable.", error);
    return [];
  }
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

function normalizeActionList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }
  if (value && typeof value === "object") {
    return [JSON.stringify(value)];
  }
  return value ? [String(value)] : [];
}

function normalizeRefreshSuggestionPayload(value: unknown) {
  if (!isRecord(value)) {
    return {
      actions: normalizeActionList(value),
      priority: 0,
      titleCandidate: "",
      metaDescriptionCandidate: "",
      missingSections: [] as SearchConsoleMissingSection[],
      internalLinkCandidates: [] as SearchConsoleInternalLinkCandidate[]
    };
  }

  return {
    actions: normalizeActionList(value.action ?? value.actions),
    priority: numberFromUnknown(value.priority),
    titleCandidate: stringFromUnknown(value.title_candidate ?? value.titleCandidate),
    metaDescriptionCandidate: stringFromUnknown(value.meta_description_candidate ?? value.metaDescriptionCandidate),
    missingSections: normalizePersistedMissingSections(value.missing_sections ?? value.missingSections),
    internalLinkCandidates: normalizePersistedInternalLinks(value.internal_link_candidates ?? value.internalLinkCandidates)
  };
}

function normalizePersistedMissingSections(value: unknown): SearchConsoleMissingSection[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (typeof item === "string") {
      return item.trim() ? [{ heading: item.trim() }] : [];
    }
    if (!isRecord(item)) {
      return [];
    }
    const heading = stringFromUnknown(item.heading);
    if (!heading) {
      return [];
    }
    return [
      {
        heading,
        why: stringFromUnknown(item.why) || undefined,
        intent: stringFromUnknown(item.intent) || undefined,
        recommended_details: Array.isArray(item.recommended_details)
          ? item.recommended_details.map((detail) => String(detail))
          : undefined
      }
    ];
  });
}

function normalizePersistedInternalLinks(value: unknown): SearchConsoleInternalLinkCandidate[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }
    const path = stringFromUnknown(item.path ?? item.href);
    if (!path) {
      return [];
    }
    return [
      {
        path,
        href: stringFromUnknown(item.href) || path,
        type: stringFromUnknown(item.type) || undefined,
        anchor: stringFromUnknown(item.anchor) || undefined,
        reason: stringFromUnknown(item.reason) || undefined,
        score: numberFromUnknown(item.score),
        score_breakdown: isRecord(item.score_breakdown)
          ? Object.fromEntries(Object.entries(item.score_breakdown).map(([key, score]) => [key, numberFromUnknown(score)]))
          : undefined
      }
    ];
  });
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

async function readAdminJson(relativePath: string) {
  try {
    const path = join(findProjectRoot(), relativePath);
    if (!existsSync(path)) {
      return {};
    }
    return JSON.parse(await readFile(path, "utf8")) as unknown;
  } catch (error) {
    console.warn(`Admin JSON unavailable: ${relativePath}`, error);
    return {};
  }
}

function summarizeJson(value: unknown) {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return `${value.length} items`;
  }
  if (isRecord(value)) {
    return Object.keys(value).slice(0, 5).join(", ");
  }
  return String(value);
}

function complianceIssuesFromJson(value: unknown) {
  if (!isRecord(value)) {
    return [];
  }
  const issues = value.issues ?? value.blockers ?? value.healthBlockers ?? value.localizationBlockers;
  return stringArrayFromUnknown(issues);
}

function findProjectRoot(start = process.cwd()) {
  let current = resolve(start);
  while (current !== dirname(current)) {
    if (existsSync(join(current, "pnpm-workspace.yaml"))) {
      return current;
    }
    current = dirname(current);
  }
  return resolve(start, "../..");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function stringFromUnknown(value: unknown) {
  return typeof value === "string" ? value.trim() : value === undefined || value === null ? "" : String(value);
}

function stringArrayFromUnknown(value: unknown) {
  return Array.isArray(value) ? value.flatMap((item) => (typeof item === "string" ? [item] : [])) : [];
}

function numberFromUnknown(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : 0;
}
