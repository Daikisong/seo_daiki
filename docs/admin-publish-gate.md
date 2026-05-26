# Admin Publish Gate

The admin publish gate protects public SEO state changes that would make an article indexable.

## Protected State

The strict gate runs when the effective article state would set:

- `indexStatus = index`

The gate blocks the update unless all of the following are true:

- `publishStatus = published`
- stored `qualityScore >= 80`
- `runQualityGate(...)` returns `index`
- there are no blocker issues
- affiliate links pass rel/disclosure validation
- canonical and hreflang values match generated SEO URLs
- enough evidence-backed claims are attached
- health, supplement, or iHerb language passes `HealthClaimGuard`

The gate is enforced in the shared DB mutation layer, so both the web API and DB admin CLI use the same protection.

## Safe State Changes

Admins may freely move articles to safer states:

- `indexStatus = noindex`
- `indexStatus = pending`
- `indexStatus = refresh_needed`
- `indexStatus = merge_candidate`
- `publishStatus = draft`
- `publishStatus = pending`

When an admin demotes a page to `draft` or `pending` while the form still submits `indexStatus=index`, the mutation layer automatically changes the effective `indexStatus` to `noindex`. This avoids a contradictory hidden-but-indexable state.

## API Behavior

`POST /api/admin/article-status` returns:

- `303` redirect when the update succeeds
- `400` JSON when the publish gate blocks the update
- `503` JSON for database or unexpected mutation failures

Blocked responses include structured reasons:

```json
{
  "error": "Article publish gate failed.",
  "articleId": "article-id",
  "gateStatus": "noindex",
  "gateScore": 72,
  "issues": [
    {
      "code": "quality_score_below_index_threshold",
      "message": "Indexable articles need stored qualityScore >= 80; found 72.",
      "severity": "blocker"
    }
  ]
}
```

## Audit Logs

Successful updates write an `AuditLog` row with:

- `action = update`
- before/after article state

Blocked index attempts write an `AuditLog` row with:

- `action = publish_gate_blocked`
- original requested state
- effective state after safety normalization
- gate status, score, and blocker issues

## CLI Behavior

`pnpm db:admin -- set-index-status <articleId> index` uses the same mutation layer as the web API.

If the gate blocks the change, the CLI prints the blocker table and exits with a non-zero status.
