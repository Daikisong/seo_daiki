# Operations Runbook

Local sample mode:

```bash
pnpm install
pnpm typecheck
pnpm seo:validate
pnpm build
pnpm dev
```

Trend and draft flow:

```bash
pnpm trend:import
pnpm trend:cluster
pnpm trend:score
pnpm brief:generate
pnpm offers:match
python3 workers/python/cli.py generate-topic-draft --topic-id topic-travel-gan-charger-buyer-guide --locale en
python3 workers/python/cli.py localize-topic-draft --article-id draft-article-brief-travel-gan-charger-buyer-guide-en --locale es
pnpm publishing:gate
```

Review the outputs in:

- `data/briefs/content_briefs.json`
- `data/exports/affiliate_placement_candidates.json`
- `data/exports/topic_articles.json`
- `data/exports/localized_topic_articles.json`
- `data/exports/topic_publishing_gate.json`

Admin and DB mode:

```bash
CONTENT_SOURCE=database ADMIN_TOKEN=change-me PREVIEW_TOKEN=change-me pnpm dev
pnpm db:migrate
pnpm db:seed
```

Use `/admin` to review topics, briefs, merchants, offers, placements, publishing jobs, compliance, localization, Search Console suggestions, and audit logs.

Safe distribution and outreach:

```bash
pnpm distribution:generate
pnpm links:assets:score
python3 workers/python/cli.py import-link-prospects --file data/seeds/link-prospects.csv
pnpm links:prospects:score
python3 workers/python/cli.py draft-outreach
```

Do not enable sending until the relevant owned-channel or SMTP adapter is configured and human approval is recorded. Community auto-posting and automatic backlink creation are intentionally absent.

Final release checks:

```bash
pnpm typecheck
pnpm seo:validate
pnpm build
```
