# Affiliate Redirect Safety

Production affiliate redirects are placement-backed only.

## Allowed Production Redirect

Production requests must use:

```text
/api/affiliate-click?placementId=<placement-id>
```

The API loads:

```text
AffiliatePlacement -> Offer -> Merchant
```

The redirect is rejected unless:

- the placement exists
- `AffiliatePlacement.status = approved`
- placement `rel` includes both `sponsored` and `nofollow`
- `disclosureShown = true`
- `Offer.status = active`
- `Merchant.enabled = true`
- `Offer.affiliateUrl` host matches `Merchant.allowedDomains`

When all checks pass, the API records `AffiliateClick` with `placementId`, `offerId`, `merchantId`, `articleId`, `productId`, `locale`, referrer, UTM data, and the final affiliate URL.

## Blocked Production Redirect

This is blocked in production:

```text
/api/affiliate-click?target=https://example.com/anything
```

Arbitrary target redirects are unsafe because the site would become an open redirect. For example, an attacker could send users through a trusted domain to a phishing page.

## Development Escape Hatch

The old `target=` mode is available only when both are true:

- `NODE_ENV !== production`
- `ALLOW_UNSAFE_AFFILIATE_TARGET_REDIRECT=true`

This is only for local demos or migration checks. Production must keep `ALLOW_UNSAFE_AFFILIATE_TARGET_REDIRECT=false`.
