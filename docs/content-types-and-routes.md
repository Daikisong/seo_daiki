# Content Types And Routes

Phase 5 adds trend-driven affiliate blogging types without removing the product-evidence article types.

## New Article Types

- `trend`: demand signal summary, why it is rising, evidence/source signals, related buyer problems, offers, localization notes, and update log.
- `buyer_guide`: decision framework, buy/avoid guidance, comparison table, affiliate offers, evidence, and risk blocks.
- `deal_watch`: price history, buy/wait/avoid zone, offer table, last checked time, and no fake urgency language.
- `ingredient_guide`: ingredient overview, supported and unsupported claims, safety warnings, health disclaimer, and iHerb offer checks.

## Localized Routes

English:

- `/en/trends/[slug]`
- `/en/buyer-guides/[slug]`
- `/en/deals/[slug]`
- `/en/ingredients/[slug]`

Spanish:

- `/es/tendencias/[slug]`
- `/es/guias-de-compra/[slug]`
- `/es/ofertas/[slug]`
- `/es/ingredientes/[slug]`

Portuguese Brazil:

- `/pt-br/tendencias/[slug]`
- `/pt-br/guias-de-compra/[slug]`
- `/pt-br/ofertas/[slug]`
- `/pt-br/ingredientes/[slug]`

## SEO Behavior

Canonical URLs and hreflang alternates are generated from `articlePath(...)`, so route rendering, metadata, JSON-LD breadcrumbs, and sitemaps use the same localized path source.

Sitemaps include the new article types only when:

- `publishStatus = published`
- `indexStatus = index`

Draft and pending articles still require `PREVIEW_TOKEN` and remain hidden from public routes.

## Health Rules

`ingredient_guide` pages are treated as health-sensitive when the copy mentions supplement or iHerb terms. Indexable pages must include an informational-only disclaimer and avoid cure, treatment, prevention, guaranteed, or unsupported medical language.
