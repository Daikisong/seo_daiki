# TREND - Jacob

TREND - Jacob is a personal product trend guide focused on marketplace products from AliExpress, Temu, Amazon, iHerb, and similar fast-moving commerce sites.

The current site is intentionally small:

- Home page with Jacob's editorial positioning
- Category archive pages under `/category/[slug]/`
- One trend article under `/en/trends/travel-gan-charger-fake-wattage-trend/`
- About, privacy, and do-not-sell pages
- A guarded affiliate redirect endpoint at `/api/affiliate-click`

## Commands

```bash
corepack pnpm --filter @trend-jacob/web dev
corepack pnpm --filter @trend-jacob/web typecheck
corepack pnpm --filter @trend-jacob/web build
```

The root shortcuts are:

```bash
corepack pnpm dev
corepack pnpm typecheck
corepack pnpm build
```

## Main Files

- `apps/web/app/page.tsx` - home page
- `apps/web/app/category/[slug]/page.tsx` - category archive route
- `apps/web/app/[locale]/trends/[slug]/page.tsx` - trend article route
- `apps/web/components/layout/TrendArchive.tsx` - shared archive layout
- `apps/web/components/layout/ArticlePage.tsx` - trend article detail layout
- `apps/web/lib/trend-site/` - categories, routes, local article data, products, and recommendation model

## Editorial Direction

Each guide should start with search demand and buyer risk, then move into products only when the topic has enough evidence. Recommendations should check:

- Search demand and ranking patterns
- Seller claims and exact variants
- Price movement and final shipped price
- Shipping terms and return paths
- Review complaints and compliance risk
- Affiliate fit and disclosure
