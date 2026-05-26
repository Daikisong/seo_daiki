# Trend Topic Engine

The trend topic engine turns raw demand signals into article briefs.

## Input

Manual CSV import is the enabled default:

```text
data/seeds/trend-signals.csv
```

Each row represents one `TrendSignal`, with scores from `0` to `100`:

- volume
- growth
- competition
- commercial fit
- freshness
- evidence fit
- affiliate fit

External collectors remain disabled-by-default until official APIs are configured. The current implementation avoids Google SERP scraping and blackhat community automation.

## Worker Commands

```bash
python3 workers/python/cli.py collect-trend-signals --file data/seeds/trend-signals.csv
python3 workers/python/cli.py import-trend-signals --file data/seeds/trend-signals.csv
python3 workers/python/cli.py cluster-topics
python3 workers/python/cli.py score-topics
python3 workers/python/cli.py generate-content-briefs
python3 workers/python/cli.py match-affiliate-offers
```

Outputs:

- `data/snapshots/trend_signals.json`
- `data/snapshots/topic_clusters.json`
- `data/snapshots/topic_scores.json`
- `data/briefs/content_briefs.json`
- `data/snapshots/affiliate_offer_matches.json`

## Scoring

The topic score uses the required weighted formula:

```text
growthScore * 0.25
+ commercialScore * 0.20
+ evidenceFitScore * 0.20
+ affiliateFitScore * 0.15
+ lowCompetitionScore * 0.10
+ freshnessScore * 0.10
```

`lowCompetitionScore` is calculated as `100 - competitionScore`.

## Health Topics

Signals containing iHerb, supplement, vitamin, probiotic, magnesium, sleep, or gut-health language become health-sensitive topics.

Health-sensitive briefs:

- use `articleType = ingredient_guide`
- prefer iHerb merchant matching
- require HealthClaimGuard
- require manual compliance approval before indexing
- include disclaimer and medical-claim guardrails in required evidence
