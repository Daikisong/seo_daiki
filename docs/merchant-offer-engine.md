# Merchant Offer Engine

The affiliate engine replaces loose article JSON links with database-backed commerce records.

## Core Tables

- `Merchant`: AliExpress, iHerb, or future merchant/network records.
- `AffiliateProgram`: tracking/network configuration for a merchant.
- `Offer`: a specific merchant offer URL and affiliate URL.
- `AffiliatePlacement`: the approved article CTA, inline link, card, or table slot that points to an offer.
- `AffiliateClick`: click log enriched with placement, offer, merchant, article, product, locale, referrer, and UTM fields.

## Seeded Merchants

The DB seed creates:

- `aliexpress`
  - `merchantType = marketplace`
  - `healthSensitive = false`
  - allowed domains from `ALIEXPRESS_ALLOWED_AFFILIATE_DOMAINS`
- `iherb`
  - `merchantType = supplement_store`
  - `healthSensitive = true`
  - allowed domains from `IHERB_ALLOWED_AFFILIATE_DOMAINS`

Sample article affiliate links are stored in `Article.affiliateLinks` with deterministic `placementId` values when seeded into Postgres. The matching `AffiliatePlacement` rows are approved only when the article is already `published` and `index`.

## Rendering

`AffiliateOutboundLink` uses a placement redirect when both conditions are true:

- `CONTENT_SOURCE=database`
- the article affiliate link has `placementId`

The rendered href becomes:

```text
/api/affiliate-click?placementId=<placement-id>
```

For sample-only content without DB-backed placements, links fall back to direct merchant URLs unless local unsafe target redirects are explicitly enabled for development.

## Admin Views

The admin dashboard includes:

- `/admin/merchants`
- `/admin/offers`
- `/admin/placements`

These pages read from Postgres when `DATABASE_URL` is configured. They are intentionally read-only at this phase, so approval and import workflows can be added after trend/offer matching is in place.
