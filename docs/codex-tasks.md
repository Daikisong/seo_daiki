# Codex Tasks

Use these tasks to continue implementation.

```text
Task 1: DB smoke test
Run docker compose, Prisma migration, seed, then start the site with CONTENT_SOURCE=database.

Task 2: Production credentials
Add real AliExpress, Search Console, and R2/S3 credentials, then run the full worker pipeline and DB import commands against production-like data.

Task 3: Worker persistence
Run `pnpm db:admin -- import-worker-outputs` after the Python pipeline to import evidence packs into Prisma. Add provider-specific enrichment as real API data arrives.

Task 4: Evidence replacement
Replace generated planned URLs with real product evidence pages as measurements and API captures accumulate.

Task 5: Postgres-backed admin QA
Smoke test archive/delete, AuditLog, lab evidence selection, and worker import flows against a real Postgres database.
```
