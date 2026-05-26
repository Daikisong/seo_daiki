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
