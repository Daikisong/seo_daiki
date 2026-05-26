# Link Earning Drafts

The link-earning layer is a CRM draft system, not a backlink bot.

Commands:

```bash
python3 workers/python/cli.py score-linkable-assets
python3 workers/python/cli.py import-link-prospects --file data/seeds/link-prospects.csv
python3 workers/python/cli.py score-link-prospects
python3 workers/python/cli.py draft-outreach
python3 workers/python/cli.py approve-outreach-message --message-id <id>
python3 workers/python/cli.py send-approved-outreach
```

Outputs:

- `data/exports/linkable_assets.json`
- `data/snapshots/link_prospects.json`
- `data/exports/link_prospect_scores.json`
- `data/exports/outreach_messages.json`
- `data/exports/outreach_send_report.json`
- `data/seeds/suppression-list.csv`

The scorer prefers data, lab, methodology, guide, comparison, and hub pages. Thin affiliate review pages are not treated as primary linkable assets.

Outreach messages start as `draft` with `approvedByHuman = false`. Sending is disabled unless `ENABLE_OUTREACH_SEND=true` and SMTP settings are configured. The local implementation still does not send email; it writes a clear blocked/skipped report.

Suppression is checked at every risky step. For example, a domain in `data/seeds/suppression-list.csv` is imported as `suppressed`, stays suppressed during scoring, cannot get a new draft, cannot be approved, and is blocked again before the disabled SMTP adapter would run.
