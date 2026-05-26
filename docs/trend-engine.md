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
python3 workers/python/cli.py match-affiliate-offers
python3 workers/python/cli.py generate-topic-draft
python3 workers/python/cli.py localize-topic-draft --locale es --locale pt-br
python3 workers/python/cli.py run-publishing-gate
```

The same details are expanded in `docs/trend-topic-engine.md`.
