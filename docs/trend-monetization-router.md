# Trend Monetization Router

This router decides the content branch after trend discovery and SERP analysis.

Plain rule:

```text
Trending topic
does not automatically mean
product-link article
```

The system now uses only two branches.

## Branch 1: informational_explainer

Use this when the searcher mainly wants an explanation, policy summary, date,
official source, checklist, or practical next step.

Examples:

- `renta 2025 avisos aeat`
- visa rule changes
- tax filing dates
- government support programs
- unconfirmed future product rumors

Allowed flow:

```text
Trend -> SERP -> ContentStrategy -> TestArticle
```

Blocked flow:

```text
ProductCandidateDiscovery
ProductCandidateAnalysisBlock
MonetizationReview
Affiliate links
```

Easy example:

```text
대입 학폭 반영
-> students and parents need policy explanation
-> no AliExpress/Amazon/iHerb product block
-> keep it in KR/ko only unless another market has its own trend signal
```

## Branch 2: review_comparison

Use this when the SERP and query show buying, review, comparison, price, deal,
spec, warranty, availability, or product category intent.

Examples:

- `Samsung S90F OLED deal`
- `iPhone 16 promoção Brasil`
- USB-C charger
- GaN charger
- power bank
- travel adapter
- desk gadget
- budget smartwatch
- magnesium supplement
- probiotic / gut health supplement
- beauty ingredient product comparison

Allowed flow:

```text
Trend
-> SERP
-> ContentStrategy
-> TestArticle
-> TranslationGroup
-> MarketLocalizedDrafts
-> ProductCandidateDiscovery
-> ProductCandidateAnalysisBlock
-> Human review later
```

Still blocked:

```text
Automatic affiliate link insertion
```

Health and supplement topics stay in `review_comparison` when a real product
comparison makes sense. They must carry a `health_claim_guard` before any human
monetization review.

Easy example:

```text
마그네슘 수면
-> supplement comparison can make sense
-> health claims need guardrails
-> no claim like "cures insomnia"
```

## Market Expansion Rule

The two branches also decide whether the article should be expanded into other
markets.

```text
review_comparison
-> product-related article
-> translate/localize for all enabled markets
-> keep translated drafts noindex until local adaptation passes

informational_explainer
-> policy/news/explainer article
-> source market only
-> do not create a market-wide translation batch
```

Easy examples:

```text
게이밍 모니터 추천
-> review_comparison
-> KR article can become JP/ja, US/en, DE/de, ES/es... localized drafts
-> each draft still needs local SERP, price, warranty, retailer, and availability notes

대입 학폭 반영
-> informational_explainer
-> KR/ko article only
-> translating it to DE/de or JP/ja would make little SEO/user sense
```

Important: product pages are not just copied translations. A localized product
article must add market-specific price, availability, warranty, retailer, return
policy, SERP angle, and product candidate context before it can become an index
candidate.

## Where This Runs

The router runs after SERP opportunity analysis and before content strategy.

```text
TrendSignal
-> TrendCluster
-> TrendKeyword
-> SERP Intelligence
-> Trend Monetization Router
-> ContentStrategy
-> TestArticle
```

The product pipeline runs the router again before product discovery so old or
manual articles are checked with the same rule.

## Scoring

The router is not a hardcoded topic list. It scores signals from SERP and the
article draft.

```text
commerce_fit_score:
- commercial or buyer intent
- review/deal/comparison article type
- product category words
- buying words such as price, discount, compare, buy
- supplement/health product words

informational_fit_score:
- informational intent
- official/article/guide type
- policy, tax, visa, school, legal, application words
- rumor/future wording
```

Decision rule:

```text
commerce_fit_score >= 35
and commerce_fit_score is at least 10 points higher than informational_fit_score
-> review_comparison

otherwise
-> informational_explainer
```

## Output

The command writes:

```text
data/exports/trend_monetization_routes.json
```

Each record includes:

- `route`
- `commerceFitScore`
- `informationalFitScore`
- `routeReason`
- `localizationPolicy`
- `allowedNextSteps`
- `blockedNextSteps`
- `requiredGuards`
- `signals`

Command:

```bash
pnpm trend:route-monetization
```
