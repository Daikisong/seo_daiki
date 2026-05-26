# Safe Posting Drafts

The distribution layer creates owned-channel drafts only. It does not auto-post to communities or create accounts.

Commands:

```bash
python3 workers/python/cli.py generate-distribution-assets
python3 workers/python/cli.py approve-distribution-asset --asset-id <id>
python3 workers/python/cli.py schedule-distribution-asset --asset-id <id>
python3 workers/python/cli.py send-approved-distribution-assets
```

Outputs:

- `data/exports/distribution_assets.json`
- `data/exports/distribution_send_report.json`

Safety rules:

- assets start as `draft`
- human approval is required by default
- Reddit/community assets are draft-only
- direct affiliate links are not generated
- sending is disabled unless `ENABLE_DISTRIBUTION_SEND=true`
- the local implementation does not send through Postiz; it reports the missing/disabled adapter instead

Example: a buyer guide can produce an X draft and LinkedIn draft that point to the article page. They remain drafts until a human approves them.
