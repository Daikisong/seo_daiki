# Trend Engine

This older page is kept as a compatibility pointer. The active trend-first design is documented in:

- `docs/trend-engine-v1.md`
- `docs/trend-signal-schema.md`
- `docs/trend-scoring.md`
- `docs/cross-market-trend-map.md`
- `docs/pipeline-priority.md`

The current default flow is:

```text
trend import -> trend cluster -> trend score -> keyword generation -> SERP analysis -> strategy -> test post
```

Use the new commands:

```bash
pnpm trend:import
pnpm trend:cluster
pnpm trend:score
pnpm trend:report
pnpm pipeline:trend-to-post
```

Offer matching, distribution drafts, outreach drafts, and live affiliate APIs are not part of the default trend engine.
They remain disabled by feature flags and are later-phase workflows.
