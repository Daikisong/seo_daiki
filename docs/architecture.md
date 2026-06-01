# Architecture

Current core architecture notes live in [`docs/core/architecture.md`](core/architecture.md). This file remains as the broader historical system overview, but new refactors should use `docs/core` as the first reference.

Global Import Lab is built as a monorepo.

```text
apps/web          Next.js App Router frontend
packages/db       Prisma schema and client
packages/content  sample evidence inventory and the generated 110 URL plan
packages/seo      canonical, hreflang, sitemap, JSON-LD helpers split by module
packages/types    shared product/article/evidence types
packages/validators quality gate and SEO validators
workers/python    collection, intelligence, evidence, writer, and feedback CLI
data              seeds, raw captures, snapshots, evidence packs, drafts, exports
```

`packages/seo` keeps the main import stable through `src/index.ts`, but the helpers also exist as separate modules:

```text
canonical.ts  locale config, localized section paths, canonical URLs
hreflang.ts   hreflang map generation
jsonld.ts     Article, Product, Review, BreadcrumbList, ItemList, Dataset JSON-LD
sitemap.ts    indexable-page filtering and sitemap entry shaping
```

Hub pages emit `Article`, `CollectionPage`, `ItemList`, and `BreadcrumbList` JSON-LD. Compare pages emit `Article`, `ItemList`, `BreadcrumbList`, and one `Product` snippet per linked comparison product. For example, a charger comparison exposes both the comparison table and the individual products in structured data. The TypeScript quality gate also validates the generated schema helpers, so a review without product data is blocked before it can remain indexable.

The important rule is simple: `Product` data comes first and `Article` pages come later.

Article page types include hub, review, guide, compare, data, lab, methodology, and country-risk pages. Country-risk pages are stored as `Article.type = risk`, but public canonical URLs use market guide routes such as `/en-us/guides/aliexpress-chargers-us-buyers/`, `/en-gb/guides/aliexpress-chargers-uk-buyers/`, `/es-es/guias/cargadores-aliexpress-espana/`, and `/pt-br/guias/carregadores-aliexpress-brasil/`. Legacy `/[locale]/risk/[slug]/` URLs redirect to the market URL and the pages are backed by `MarketRisk`, review-signal, claim, and verified-claim evidence.

Example:

```text
seller title says "65W"
variant map finds a 45W cheapest SKU
verified claim records sustained output
market risk records customs/plug/return risk
article renders those facts and quality gate decides index/noindex
```

This keeps the site closer to a product verification database than an affiliate post factory.

The web repository can run in two modes:

```text
default: sample evidence inventory from packages/content
CONTENT_SOURCE=database: Prisma-backed Product/Article/EvidencePack records
```

예를 들어 로컬 DB가 아직 없으면 샘플 데이터로 빌드되고, Postgres를 띄운 뒤 `CONTENT_SOURCE=database pnpm dev`를 쓰면 같은 페이지 컴포넌트가 DB 레코드를 읽는다.

The v1 worker queue is a cron-friendly CLI pipeline:

```text
pnpm worker:pipeline -> data/exports/pipeline_run.json
```

That single command runs seed import, identity graph, variant traps, seller claims, price truth, locale risk, review signals, verified claims, locale evidence packs, outlines, drafts, Search Console suggestions, URL inventory, and the Python quality gate. For example, the checked-in cron template in `docs/worker-cron.example` can run the local-data pipeline every night without adding Redis or Celery yet.

Analytics and feedback paths:

```text
affiliate button -> /api/affiliate-click -> AffiliateClick -> target URL redirect
affiliate button -> GA4 affiliate_click event when NEXT_PUBLIC_GA4_MEASUREMENT_ID is set
Search Console rows -> SearchConsoleMetric -> PageRefreshSuggestion
NEXT_PUBLIC_GA4_MEASUREMENT_ID -> GA4 script injection
```

Admin mutation paths:

```text
ADMIN_TOKEN -> /api/admin/article-status -> Article indexStatus/publishStatus/qualityScore
ADMIN_TOKEN -> /api/admin/evidence-record -> Product/Variant/Claim/Risk/EvidencePack create/update
ADMIN_TOKEN -> /api/admin/lab-evidence -> data/uploads/lab + LabEvidenceAsset in database mode
ADMIN_TOKEN -> /api/admin/record-action -> archive/delete + AuditLog
/api/lab-evidence-file/<storageKey> -> stored measurement file
```

The quality admin view combines the quality gate with operations checks: evidence count, internal-link count, hreflang issues, schema issues, affiliate rel issues, and duplicate candidates from the product identity graph. For example, if two cable products share the same brand and title pattern but differ by wattage, the dashboard can surface that duplicate candidate without blocking the page.

Dataset downloads are served by `/datasets/<file>.csv`. The route maps file names such as `power-bank-claimed-mah-vs-real-wh.csv` or `usb-c-cable-100w-verification-table.csv` to the relevant product category and emits a small CSV from the same product repository used by the page.

Archive keeps the record with `archivedAt` so normal database-backed content readers can filter it out. Delete physically removes the record. Both paths write an `AuditLog` row; product archive also marks related articles `noindex` and `draft`, for example archiving a charger record removes it from live product views without leaving its generated review indexable.

Lab evidence storage defaults to local files. Setting `LAB_EVIDENCE_STORAGE_DRIVER=r2` or `s3` switches the same upload path to S3-compatible object storage and stores the remote public URL in `LabEvidenceAsset`.

Worker persistence path:

```text
AliExpress/Open Platform search -> data/raw/aliexpress-*.json
Python evidence packs -> pnpm db:admin -- import-worker-outputs -> Prisma product evidence tables
Search Console snapshot -> pnpm db:admin -- import-search-console -> SearchConsoleMetric
Search Console suggestions -> pnpm db:admin -- import-refresh-suggestions -> PageRefreshSuggestion
PageRefreshSuggestion -> /admin/search-console or pnpm db:admin -- set-refresh-suggestion-status -> AuditLog
data/snapshots + data/exports -> /admin/search-console performance and refresh tables
```

The checked-in sample seed covers 10 imported products. The worker snapshots include variant traps, seller claims, verified-claim placeholders, prices, locale risks, and locale-specific review signals so the evidence pack builder can produce index-gate-ready packs without inventing facts in the article writer.

The checked-in article inventory now keeps the generated 110-URL plan conservative and adds explicit evidence-first URLs for the first 90-day structure:

```text
/en/methodology/how-we-test-usb-c-chargers/
/en/methodology/how-we-score-aliexpress-products/
/en/methodology/price-truth-score/
/en/data/65w-gan-charger-output-table/
/en/data/usb-c-cable-100w-verification-table/
/en/data/power-bank-claimed-mah-vs-real-wh/
/en/usb-c-chargers/
/en/usb-c-cables/
/en/power-banks/
```

The price truth step is explicit:

```text
price_snapshots.json -> build-price-truth -> price_truth.json -> evidence packs
```

예를 들어 USB-C charger는 shipped price가 `$18` 미만이면 `buy`, `$18-$24`이면 `wait`, 그 이상이면 `avoid`가 된다. 같은 로직이 케이블, power bank, tool, sensor 카테고리별 임계값을 따로 쓴다.

Article writing is split into outline and draft steps:

```text
evidence pack -> generate-outline -> data/outlines/<locale>-<type>.json
outline + evidence pack -> generate-draft -> data/drafts/<locale>-<type>.md
```

예를 들어 review outline은 “판매자 주장 vs 검증 사실”, “옵션 함정”, “가격과 로컬 리스크”, “근거/업데이트 로그” 같은 섹션을 먼저 만들고, 각 섹션에 어떤 evidence record를 써야 하는지 적는다. 이렇게 하면 LLM 초안은 빈손으로 글을 쓰는 게 아니라 정해진 설계도 안에서만 문장을 만든다.

The refresh worker looks for pages with enough impressions, low CTR, and average position 8-30. For each matching page/query row it estimates whether the current page sections cover the query terms, then exports a concrete missing-section recommendation, title/meta rewrite candidates, and internal links scored by same locale, same category, same claim, same problem, alternative price band, and risk overlap.

For example, a query like `aliexpress charger not 65w` on a guide page can produce a section such as `Why this charger may not deliver the advertised wattage`, plus links from the USB-C charging hub, data table, and lab evidence pages.

Persisted refresh suggestions keep the full rewrite payload in `PageRefreshSuggestion.actions`: action text, priority, diagnostics, missing sections, title/meta candidates, and internal-link candidates. The workflow is small: `open` means the suggestion has not been triaged, `planned` means it has been assigned for rewrite, `applied` means the content change was shipped, and `dismissed` means the suggestion was intentionally rejected. Status changes are available in `/admin/search-console` and the DB admin CLI, and each change writes an audit record.

LLM draft generation uses a provider interface:

```text
LLM_PROVIDER=dry-run    placeholder draft, safe for local setup
LLM_PROVIDER=openai     OPENAI_API_KEY + OPENAI_MODEL
LLM_PROVIDER=gemini     GEMINI_API_KEY + GEMINI_MODEL
LLM_PROVIDER=anthropic  ANTHROPIC_API_KEY + ANTHROPIC_MODEL
LLM_PROVIDER=ollama     local Ollama HTTP endpoint
```

For example, switching from local Ollama to OpenAI changes environment variables, not the article generation command.
