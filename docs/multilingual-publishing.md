# Multilingual Publishing

Phase 6 links localized articles as one translation group instead of treating each locale as an unrelated page.

## Data Model

- `TranslationGroup`: one canonical topic/article family.
- `TranslationVariant`: one locale variant inside the group.
- `PublishingJob`: queued, running, completed, failed, or blocked draft/localize/validate/publish/refresh work.

Example:

```text
TranslationGroup
  sourceArticleId = art-en-buyer-guide-travel-gan
  variants:
    en     localizationDepthScore 100  index
    es     localizationDepthScore 84   index
    pt-br  localizationDepthScore 84   index
```

Translation-only pages remain `noindex` until they have local search intent, local market/risk notes, local offer availability or an explicit no-offer note, hreflang group membership, and non-boilerplate localized content.

Market-wide localization is only automatic for `review_comparison` topics. These
are product-related articles where the same buyer problem can exist across
markets, such as chargers, monitors, supplements, adapters, and gadgets.
`informational_explainer` topics stay in the source market/language unless a
separate market trend and SERP opportunity exists.

Easy example:

```text
게이밍 모니터 추천
-> review_comparison
-> create localized drafts for enabled markets

대입 학폭 반영
-> informational_explainer
-> KR/ko only
```

## Localization Score

```text
localizedQueryFit * 0.25
+ localRiskCoverage * 0.20
+ localOfferFit * 0.20
+ languageQuality * 0.15
+ nonBoilerplateScore * 0.10
+ localExamples * 0.10
```

Rules:

- `< 70`: `noindex`
- `70-79`: `pending`
- `>= 80`: eligible for `index` only if the normal publishing and quality gates also pass

## Worker Commands

```bash
python3 workers/python/cli.py create-translation-group --article-id art-en-buyer-guide-travel-gan
python3 workers/python/cli.py localize-article --article-id art-en-buyer-guide-travel-gan --locale es
python3 workers/python/cli.py localize-article --article-id art-en-buyer-guide-travel-gan --locale pt-br
python3 workers/python/cli.py score-localization
python3 workers/python/cli.py sync-hreflang-groups
```

Local runs write:

- `data/exports/translation_groups.json`
- `data/exports/localization_scores.json`
- `data/exports/hreflang_groups.json`

When Postgres is connected, the same concepts map to the Prisma models.
