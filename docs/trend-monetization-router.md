# Trend Monetization Router

This is a simple decision layer between trend detection and product candidate
discovery.

The problem:

```text
Trend is popular
does not mean
Trend should get product links
```

Example:

```text
2026 대입 학폭 반영
```

This can be a real Korean trend, but it should not flow into AliExpress, Temu,
Amazon, or iHerb product recommendations. A product block would feel forced and
would damage trust.

## Goal

Before product candidate discovery runs, every trend/article gets a monetization
route:

```text
commerce_ready
health_commerce_guarded
research_only
blocked_for_monetization
```

## Routes

### commerce_ready

Use when a trend naturally becomes product comparison.

Examples:

- OLED TV discount
- USB-C charger
- GaN charger
- power bank
- travel adapter
- desk gadget
- budget smartwatch

Allowed next step:

```text
ProductCandidateDiscovery -> ProductCandidateAnalysisBlock
```

### health_commerce_guarded

Use when a trend can connect to supplements or wellness products, but claims
need guardrails.

Examples:

- magnesium sleep
- probiotics / gut health
- vitamin D
- beauty ingredient
- collagen

Allowed next step:

```text
ProductCandidateDiscovery allowed
but health claim guard required
```

Rules:

- Do not say a supplement treats, cures, or prevents a disease.
- Do not promise sleep, weight loss, gut recovery, hormone balance, or medical effects.
- Prefer wording like "may support" only when supported by evidence.
- Add evidence requirements and disclaimers before monetization review.
- Human approval remains required.

Example:

```text
Magnesium sleep
-> product comparison possible
-> blocked phrases: "cures insomnia", "treats anxiety", "guaranteed sleep"
```

### research_only

Use when the trend has informational traffic but product links would feel
unnatural.

Examples:

- tax filing
- visa rules
- government support programs
- college admissions policy
- school policy changes without a product angle

Allowed next step:

```text
ContentStrategy -> TestArticle
```

Blocked next step:

```text
ProductCandidateDiscovery
```

Example:

```text
종합소득세 신고 기간
-> useful informational article
-> no product candidate analysis
```

### blocked_for_monetization

Use when monetization would damage trust or create sensitive-topic risk.

Examples:

- school violence
- minors involved in harm
- legal disputes
- victim/crime issues
- medical diagnosis
- emergency health symptoms
- tragedy or active crisis

Allowed next step:

```text
Information-only article, if editorially appropriate
```

Blocked next step:

```text
ProductCandidateDiscovery
MonetizationReview
Affiliate link insertion
```

Example:

```text
2026 대입 학폭 반영
-> trend may be real
-> article can explain policy
-> product links are blocked
```

## Scoring Idea

This should be implemented later as a score, not keyword hardcoding.

```text
commerce_fit_score =
  buyerIntentScore * 0.25
+ productEntityScore * 0.20
+ serpCommercialPatternScore * 0.20
+ catalogMatchScore * 0.20
+ comparisonPotentialScore * 0.15
- complianceRiskPenalty
- sensitivityRiskPenalty
```

Plain explanation:

- `buyerIntentScore`: does the query sound like buying, comparing, reviewing, or pricing?
- `productEntityScore`: is there a real product category?
- `serpCommercialPatternScore`: do top pages use product cards, review boxes, prices, or comparison tables?
- `catalogMatchScore`: can real merchant products be found without forcing it?
- `comparisonPotentialScore`: can products be compared by specs, price, capacity, ingredients, compatibility, or use case?
- `complianceRiskPenalty`: are there claims that need legal, medical, or policy caution?
- `sensitivityRiskPenalty`: would monetization look exploitative or harmful?

## Suggested Thresholds

```text
commerce_fit_score >= 75
and sensitivity risk low
-> commerce_ready

health/wellness product exists
and disease/medical claim risk is controllable
-> health_commerce_guarded

commerce_fit_score < 45
and sensitivity risk low
-> research_only

sensitivity risk high
-> blocked_for_monetization
```

## Pipeline Rule

The product pipeline must not run just because a trend is popular.

Correct flow:

```text
TrendCluster
-> TrendKeyword
-> SERP Intelligence
-> ContentStrategy
-> TestArticle
-> Trend Monetization Router
-> ProductCandidateDiscovery only if route allows it
```

## First Implementation Later

When implemented, add fields like:

```text
monetizationRoute
commerceFitScore
sensitivityRiskScore
healthClaimRiskScore
routeReason
blockedNextSteps
requiredGuards
```

Do not implement live merchant APIs as part of this router.

This router only decides whether the article is allowed to enter product
candidate discovery.
