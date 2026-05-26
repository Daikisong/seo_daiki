# Trend Engine v1

The Trend Engine is the first real engine.

It imports market-specific trend signals from manual CSV first, then normalizes, clusters, scores, and turns them into keywords.

Commands:

```bash
pnpm trend:init-markets
pnpm trend:import
pnpm trend:cluster
pnpm trend:score
pnpm trend:generate-keywords
pnpm trend:report
```

Sources supported now:

- `manual_csv`
- `google_trends_export`
- `google_trending_now_export`
- `search_console`
- `google_news_rss`
- optional/disabled social or merchant signals

Google Trends-style data is treated as relative and sampled. The system never invents absolute volume from relative trend values.
