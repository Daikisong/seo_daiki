# Hreflang Market Variants

Market home hreflang and content-page hreflang are intentionally different.

## Market Homes

Market home pages exist for every enabled market, so they can use:

```ts
buildMarketHreflangMap()
```

Example:

```text
/us/en/
/gb/en/
/ca/en/
```

These pages are real market homes even if they are noindex while thin.

## Content Pages

Content pages must use existing variants only:

```ts
buildExistingMarketContentHreflangMap(variants, currentVariant)
```

Example:

```text
/us/en/trends/magnesium-sleep/ exists
/gb/en/trends/magnesium-sleep/ does not exist
```

The hreflang map includes only the US URL. It must not invent the GB URL.

## Variant Shape

```ts
{
  market: "us",
  language: "en",
  path: "/us/en/trends/magnesium-sleep/",
  hreflang: "en-US",
  status: "scored",
  exists: true,
  indexable: true
}
```

## X-Default

Content research pages use:

```text
/global/trend-map/
```

Market homes use:

```text
/global/markets/
```

## Validation

`pnpm seo:market-audit` checks:

- no alternate URL points to a missing variant
- all variants for the same slug return the same hreflang set
- `x-default` is present
