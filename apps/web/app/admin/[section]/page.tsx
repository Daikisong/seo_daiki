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
  ContentBriefStatusForm,
  MerchantForm,
  OfferForm,
  PlacementStatusForm,
  PublishingJobRetryForm,
  QualityStat,
  QueuePublishingJobForm,
  RecordActionForm,
  TextInput,
  TopicStatusForm
} from "./AdminForms";
import {
  EvidencePackForm,
  MarketRiskForm,
  ProductForm,
  SellerClaimForm,
  VariantForm,
  VerifiedClaimForm
} from "./EvidenceRecordForms";
import { verifiedClaimOptionRows } from "@/lib/admin/admin-evidence-form-model";
import { buildAdminQualityRows, buildAdminQualityStats, issueCodes } from "@/lib/admin/admin-quality-model";
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
  readPublishingJobRows,
  readTopicRows,
  readTrendRows
} from "@/lib/admin/admin-section-data";
import { scoreBreakdownSummary, stringFromSearchParam } from "@/lib/admin/admin-section-utils";
import { getAllArticles, getAllEvidencePacks, getAllProducts } from "@/lib/content/repository";
import { runQualityGate } from "@global-import-lab/validators";
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
    const verifiedClaimOptions = verifiedClaimOptionRows(products);

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
        <AdminPanel title="Later-phase monetization candidates">
          {candidates.length === 0 ? (
            <p className="text-sm text-neutral-700">
              Offer matching is a later-phase feature flag. Run <code>pnpm pipeline:post-to-product-analysis</code> first,
              then create a monetization review only after human approval.
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
