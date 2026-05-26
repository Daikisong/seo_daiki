# Content Types

## Hub

Category-level page. It explains what the site verifies and links to data, lab, review, guide, compare, and country-risk pages.

Examples:

```text
/en/usb-c-chargers/
/en/usb-c-cables/
/en/power-banks/
```

## Review

Product-level page generated from Product, Variant, SellerClaim, VerifiedClaim, ReviewSignal, PriceSnapshot, and MarketRisk records.

Examples:

```text
/en/reviews/baseus-65w-gan-charger-real-output/
/es/resenas/cargador-gan-65w-baseus-potencia-real/
/pt-br/analises/carregador-gan-65w-baseus-potencia-real/
```

## Guide

Problem-solving page for long-tail searches.

Examples:

```text
/en/guides/aliexpress-charger-fake-watts/
/es/guias/cargador-aliexpress-watts-falsos/
/pt-br/guias/carregador-aliexpress-watts-falsos/
```

## Compare

Compares products or wattage classes by claim, evidence, price, and risk.

Examples:

```text
/en/compare/65w-vs-100w-gan-charger/
/en/compare/aliexpress-charger-vs-amazon-alternative/
```

## Data

Structured evidence table that review pages can cite.

Top-level index: `/data/`

Examples:

```text
/en/data/65w-gan-charger-output-table/
/en/data/usb-c-cable-100w-verification-table/
/en/data/power-bank-claimed-mah-vs-real-wh/
```

## Lab

Method and measurement page.

Top-level index: `/lab/`

Example: `/en/lab/65w-gan-charger-real-output-test/`

Lab measurement files can be attached through `/admin/evidence`. The upload stores the raw file and, in database mode, records a `LabEvidenceAsset` row that can be linked to a verified claim.

## Risk

Country-specific import risk page. It is not a translation-only article; it should explain local customs, plug, certification, return, and marketplace-alternative risk.

Examples:

```text
/en-us/guides/aliexpress-chargers-us-buyers/
/en-gb/guides/aliexpress-chargers-uk-buyers/
/es-es/guias/cargadores-aliexpress-espana/
/pt-br/guias/carregadores-aliexpress-brasil/
```

The legacy `/[locale]/risk/[slug]/` route redirects to the market guide URL when a country-specific route exists.

## Methodology

Explains how claims, evidence, risk scores, and index gates are produced.

Examples:

```text
/en/methodology/how-we-test-usb-c-chargers/
/en/methodology/how-we-score-aliexpress-products/
/en/methodology/price-truth-score/
```
