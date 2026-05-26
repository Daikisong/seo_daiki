# Admin Operations

Phase 11 expands `/admin` from product evidence operations into a broader publishing console.

Sections:

- `/admin/trends/`: trend signals from Postgres or `data/snapshots/trend_signals.json`
- `/admin/topics/`: topic scores and DB status changes
- `/admin/briefs/`: content brief review and DB status changes
- `/admin/merchants/`: create or edit merchants with allowed domains
- `/admin/offers/`: create or edit offers tied to merchants
- `/admin/placements/`: approve or reject DB-backed affiliate placements
- `/admin/offer-matching/`: review exported placement candidates
- `/admin/publishing-jobs/`: inspect jobs and retry DB-backed failures
- `/admin/compliance/`: health, localization, and publishing gate issues
- `/admin/localization/`: translation groups or localized draft exports

All mutation endpoints require `ADMIN_TOKEN` and write `AuditLog` rows in DB mode.

Example: a topic exported from the CSV worker can be inspected without Postgres. Once the topic is persisted to Postgres, the same page can move it from `candidate` to `briefed`, and that status change is audited.

DB-backed mutation endpoints:

- `/api/admin/topic-status`
- `/api/admin/content-brief-status`
- `/api/admin/merchant`
- `/api/admin/offer`
- `/api/admin/affiliate-placement-status`
- `/api/admin/publishing-job-retry`

Sample mode remains read-only for the new workflow pages. This keeps local review useful without pretending file exports are production database state.
