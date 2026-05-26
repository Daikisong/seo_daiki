# AliExpress API Playbook

Status: later phase. Do not implement live integration now.

Required later:

- approved AliExpress affiliate account
- official app key and secret
- tracking ID
- documented product search permission
- documented affiliate link generation permission

Boundaries:

- Use official API/portal only.
- Do not scrape AliExpress pages.
- Do not auto-refresh prices without allowed source.
- Do not create affiliate links before human approval.

Future fields for `ProductCandidate`:

- product title
- product URL
- image URL
- price text and currency
- category
- availability market
- merchant/source mode
- policy and disclosure requirements

Variant traps:

- The adapter must detect product pages where options change wattage, plug type, cable inclusion, or capacity.
- Claims cannot be reused across variants unless verified.

Future adapter:

- `AliExpressLiveAdapter`
- disabled now with clear not-implemented errors
