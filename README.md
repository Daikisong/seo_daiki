# Global Import Lab

Multilingual SEO product intelligence site for imported ecommerce products.

This is not a generic affiliate blog. The core is a product evidence database:

- Product, variant, seller claim, verified claim, review signal, price snapshot, market risk, evidence pack, and article models
- Next.js App Router pages for `/en`, `/es`, `/pt-br`
- Self canonical URLs, hreflang alternates, robots, sitemap, JSON-LD helpers
- Split sitemap index at `/sitemaps/index.xml` with hubs, products, guides, lab, data, compare, risk, and methodology buckets
- Localized review paths: `/en/reviews`, `/es/resenas`, `/pt-br/analises`
- Country-risk pages use regional guide URLs such as `/en-us/guides/aliexpress-chargers-us-buyers/`, `/en-gb/guides/aliexpress-chargers-uk-buyers/`, `/es-es/guias/cargadores-aliexpress-espana/`, and `/pt-br/guias/carregadores-aliexpress-brasil/`; legacy `/[locale]/risk/...` routes redirect to those canonical URLs
- Category hubs and evidence-first URLs for `/en/usb-c-cables`, `/en/power-banks`, `/en/data/usb-c-cable-100w-verification-table`, `/en/data/power-bank-claimed-mah-vs-real-wh`, and price/scoring methodology pages
- Language preference banner without automatic redirects
- Affiliate click tracking route, GA4 `affiliate_click` events, and optional GA4 script injection
- Quality gates before a page can be indexed, including evidence, thin-affiliate, hreflang/canonical, JSON-LD schema, and affiliate-link checks
- Python worker CLI for seed import, identity grouping, variant traps, evidence packs, drafts, and Search Console suggestions
- LLM provider interface for dry-run, OpenAI, Gemini, Anthropic, and Ollama draft generation
- Sample product evidence seed: 10 imported products across chargers, cables, power banks, tools, and sensors
- Initial URL inventory: 110 planned URLs with exactly 60 currently indexable sample pages after quality gates

## Setup

```bash
corepack enable
corepack prepare pnpm@10.33.4 --activate
pnpm install
cp .env.example .env
```

## Run

```bash
pnpm dev
```

## Verify

```bash
pnpm typecheck
pnpm seo:validate
pnpm build
```

## Database

```bash
docker compose up -d postgres
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm db:admin -- list-articles
pnpm db:admin -- list-lab-evidence
pnpm db:admin -- list-audit-logs
pnpm db:admin -- list-refresh-suggestions open
pnpm db:admin -- quality-summary
pnpm db:admin -- set-index-status <articleId> pending
pnpm db:admin -- set-refresh-suggestion-status <suggestionId> applied
pnpm db:admin -- archive-record article <articleId>
pnpm db:admin -- delete-record variant <variantId>
pnpm db:admin -- import-worker-outputs
pnpm db:admin -- import-search-console data/snapshots/search_console_rows.json
pnpm db:admin -- import-refresh-suggestions data/exports/search_console_suggestions.json
```

## Worker Pipeline

For the v1 cron-style queue, run the whole local-data pipeline with one command:

```bash
pnpm worker:pipeline
```

This writes a machine-readable run report to `data/exports/pipeline_run.json`. A crontab example is available in `docs/worker-cron.example`.

```bash
python3 workers/python/cli.py seed-products --file data/seeds/usb-c-chargers.csv
python3 workers/python/cli.py search-aliexpress-products --keyword "65w gan charger"
python3 workers/python/cli.py build-identity-graph
python3 workers/python/cli.py detect-variant-traps
python3 workers/python/cli.py extract-seller-claims
python3 workers/python/cli.py snapshot-prices
python3 workers/python/cli.py build-price-truth
python3 workers/python/cli.py build-locale-risk
python3 workers/python/cli.py extract-review-signals
python3 workers/python/cli.py build-verified-claims
python3 workers/python/cli.py build-evidence-pack --locale en
python3 workers/python/cli.py generate-outline --locale en --type review
python3 workers/python/cli.py generate-draft --locale en --type review
python3 workers/python/cli.py run-quality-gate
python3 workers/python/cli.py import-search-console
python3 workers/python/cli.py import-search-console --start-date 2026-04-25 --end-date 2026-05-25
python3 workers/python/cli.py suggest-refreshes
python3 workers/python/cli.py generate-url-inventory --file data/seeds/initial-url-plan.csv
```

Use `python3 workers/python/cli.py run-pipeline --keyword "65w gan charger"` when AliExpress credentials are configured and you want the official API search step included. Without `--keyword`, the pipeline uses the checked-in seed CSV and avoids network/API credentials.

`search-aliexpress-products` requires `ALIEXPRESS_APP_KEY`, `ALIEXPRESS_APP_SECRET`, and `ALIEXPRESS_TRACKING_ID`. Without credentials, use the checked-in seed CSV for local runs.

Outline generation writes `data/outlines/<locale>-<type>.json` before the draft step. For example, a review outline lists the verdict, seller-claim, variant-trap, price-risk, review-signal, and evidence sections plus the evidence refs each section may cite.

Draft generation defaults to `LLM_PROVIDER=dry-run`, which writes a non-indexable placeholder note. To use a real provider, set the provider and its key, for example:

```bash
LLM_PROVIDER=openai OPENAI_API_KEY=... python3 workers/python/cli.py generate-draft --locale en --type review
LLM_PROVIDER=gemini GEMINI_API_KEY=... python3 workers/python/cli.py generate-draft --locale es --type review
LLM_PROVIDER=anthropic ANTHROPIC_API_KEY=... python3 workers/python/cli.py generate-draft --locale pt-br --type review
LLM_PROVIDER=ollama OLLAMA_BASE_URL=http://localhost:11434 python3 workers/python/cli.py generate-draft --locale en --type review
```

The Python quality gate writes `data/exports/quality_gate.json`. It checks evidence schema, claim support, thin-affiliate risk, locale depth, localized URL rules, internal-link inventory, affiliate URL readiness, duplicate similarity, and hallucination guardrails.

The sample web app renders from local TypeScript data so it can build without a running database. Prisma is ready for local Postgres and production Postgres.

To render from Postgres instead of the sample content, seed the database and run with:

```bash
CONTENT_SOURCE=database pnpm dev
```

If the database is unavailable, the repository layer falls back to the sample evidence inventory so local builds still work.

## Admin Mutations

Set `ADMIN_TOKEN` before using admin forms or mutation APIs:

```bash
ADMIN_TOKEN=change-me CONTENT_SOURCE=database pnpm dev
```

Set `PREVIEW_TOKEN` to inspect draft or pending pages without exposing them publicly:

```bash
PREVIEW_TOKEN=change-me pnpm dev
```

Then open the draft URL with `?previewToken=change-me`. Preview pages always render with `noindex, follow`.

Available mutation endpoints:

```text
POST /api/admin/article-status
POST /api/admin/evidence-record
POST /api/admin/lab-evidence
POST /api/admin/record-action
GET  /api/lab-evidence-file/<storageKey>
```

`/api/admin/evidence-record` handles Product, Variant, SellerClaim, VerifiedClaim, MarketRisk, and EvidencePack create/update forms from `/admin/products` and `/admin/evidence`.

`/api/admin/record-action` handles archive/delete actions for Product, Variant, SellerClaim, VerifiedClaim, MarketRisk, EvidencePack, and Article rows. Archive keeps the record with `archivedAt`; delete physically removes it. Both actions write `AuditLog` rows, and article/product archive paths move affected articles to `noindex`/`draft`.

`/admin/quality` shows the publishing gate plus operational SEO signals: evidence count, internal-link count, hreflang issues, schema issues, affiliate rel issues, and high-confidence duplicate candidates from the product identity graph.

Data pages link to `/datasets/<article-slug>.csv`, which returns a category-scoped CSV from the current product repository. For example, `/datasets/65w-gan-charger-output-table.csv` exports charger rows with claim counts, variant counts, and latest price fields.

Lab evidence uploads are stored in `data/uploads/lab` by default and are recorded in `LabEvidenceAsset` when `CONTENT_SOURCE=database` is enabled. Without database mode, the file still saves locally, which is useful for a quick measurement upload smoke test.

For object storage, set `LAB_EVIDENCE_STORAGE_DRIVER=r2` with the `CLOUDFLARE_R2_*` variables, or `LAB_EVIDENCE_STORAGE_DRIVER=s3` with the `S3_*` variables. The same upload form then writes the file to the bucket and stores the public URL in the asset record.

`/admin/search-console` reads `data/snapshots/search_console_rows.json` or the sample snapshot plus `data/exports/search_console_suggestions.json` so query/page/country/device performance and refresh actions are visible before database persistence is available. The refresh export includes section-gap reasoning, title/meta candidates, and internal-link candidates with score parts such as same locale, same category, same claim, same problem, price-band alternative, and risk overlap. After importing suggestions into Postgres, the same admin page can mark each `PageRefreshSuggestion` as `open`, `planned`, `applied`, or `dismissed`; those status changes write `AuditLog` rows.
