# Trend Engine

This is the Phase 4 operating guide for trend discovery and topic brief generation.

The local v1 engine is CSV-first and safe by default:

- no Google SERP scraping
- no automated community posting
- no external API calls unless a future adapter is explicitly configured
- no publishing without the article quality and compliance gates

## Commands

```bash
python3 workers/python/cli.py import-trend-signals --file data/seeds/trend-signals.csv
python3 workers/python/cli.py cluster-topics
python3 workers/python/cli.py score-topics
python3 workers/python/cli.py generate-content-briefs
python3 workers/python/cli.py match-affiliate-offers --offers-file data/seeds/offers.csv
python3 workers/python/cli.py generate-topic-draft --topic-id topic-travel-gan-charger-buyer-guide --locale en
python3 workers/python/cli.py localize-topic-draft --article-id draft-article-brief-travel-gan-charger-buyer-guide-en --locale es
python3 workers/python/cli.py run-publishing-gate
```

The same details are expanded in `docs/trend-topic-engine.md`.
