# Test Posting Flow

Article states:

- `draft`
- `test_pending`
- `test_published_noindex`
- `test_published_index_candidate`
- `performance_monitoring`
- `needs_product_analysis`
- `approved_for_monetization`
- `rejected`

Default behavior:

- `publishStatus=pending`
- `indexStatus=noindex`
- no affiliate links
- product candidate analysis pending

Commands:

```bash
pnpm strategy:create
pnpm strategy:generate-brief
pnpm post:generate-test
pnpm post:publish-test
```
