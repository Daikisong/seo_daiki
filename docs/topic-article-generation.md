# Topic Article Generation

Phase 9 keeps the original product evidence draft flow and adds a separate topic article flow.

Flow:

```text
TrendSignal -> Topic -> ContentBrief -> Draft Article -> Localized Draft -> Publishing Gate
```

Modules:

- `workers/python/writers/topic_brief_generator.py`
- `workers/python/writers/topic_article_generator.py`
- `workers/python/writers/topic_localizer.py`
- `workers/python/validators/publishing_gate.py`

Commands:

```bash
python3 workers/python/cli.py generate-content-briefs
python3 workers/python/cli.py generate-topic-draft --topic-id topic-travel-gan-charger-buyer-guide --locale en
python3 workers/python/cli.py localize-topic-draft --article-id draft-article-brief-travel-gan-charger-buyer-guide-en --locale es
python3 workers/python/cli.py run-publishing-gate
```

Outputs:

- `data/exports/topic_articles.json`
- `data/exports/localized_topic_articles.json`
- `data/exports/topic_publishing_gate.json`
- markdown drafts in `data/drafts/`

Generated articles deliberately start safe:

```text
publishStatus = pending
indexStatus = pending or noindex
qualityScore <= 79
```

That means a generated draft is like a document waiting on an editor's desk: it exists, but it is not public/indexable until the gate and an admin review approve it.

Generation constraints:

- do not invent prices, discounts, tests, specs, reviews, or certifications
- do not claim "we tested" without verified claims
- do not create fake urgency
- do not give medical advice
- include affiliate disclosure when offers exist
- include health disclaimer for supplement/iHerb content
- localized drafts stay `noindex` until their localization depth is strong enough
