# Global Import Lab

Global trend-to-content research and publishing system.

The project is no longer described as an affiliate auto-blog first. The priority is:

1. Trend Engine
2. SERP Intelligence
3. Test Posting
4. Product Candidate Analysis
5. Human-approved monetization
6. Live affiliate APIs later

Think of it like this: the system first notices that “magnesium sleep” is moving in the US, “USB-C charger” is moving in Spain, and “power bank real capacity” is moving in Brazil. It then studies the top pages for each market, decides what kind of article should be tested, publishes a no-link test post, and only later suggests product candidates for human review.

## Market Structure

One domain is used with market silos:

```text
/us/en/
/es/es/
/br/pt-br/
/jp/ja/
/kr/ko/
```

The site supports 18 initial markets in `data/config/markets.json`: US, GB, CA, AU, ES, MX, BR, PT, FR, DE, IT, NL, PL, TR, ID, JP, KR, and IN.

Global pages such as `/global/trend-map/` summarize cross-market patterns, but they do not replace each market desk.

## What Runs First

The default worker pipeline runs:

```text
trend import
trend cluster
trend score
keyword generation
SERP import and analysis
content strategy
test article generation
```

It does not run offer matching, distribution drafts, outreach drafts, live affiliate APIs, or automatic monetized link insertion.

## Setup

```bash
corepack enable
corepack prepare pnpm@10.33.4 --activate
pnpm install
cp .env.example .env
```

## Run The Sample Flow

```bash
pnpm pipeline:trend-to-post
pnpm pipeline:post-to-product-analysis
pnpm pipeline:monetization-review
```

The first command writes trend, SERP, strategy, and test-post outputs under `data/exports/`. The second command creates product candidate analysis blocks. The third command creates pending human reviews; it does not insert links.

## Worker Commands

```bash
pnpm trend:import
pnpm trend:cluster
pnpm trend:score
pnpm trend:report

pnpm serp:import
pnpm serp:analyze
pnpm serp:report

pnpm strategy:create
pnpm post:generate-test
pnpm post:publish-test

pnpm calendar:build
pnpm calendar:report

pnpm performance:import
pnpm performance:recommend

pnpm products:import-candidates
pnpm products:analyze-candidates

pnpm monetization:create-review
pnpm monetization:draft-placements
pnpm monetization:apply-approved
```

Legacy offer matching, distribution drafts, and outreach drafts remain in the repo, but they are disabled by default with feature flags.

## Feature Flags

Default behavior:

```text
ENABLE_OFFER_MATCHING=false
ENABLE_DISTRIBUTION_DRAFTS=false
ENABLE_LINK_EARNING=false
ENABLE_LIVE_AFFILIATE_APIS=false
ENABLE_PRODUCT_CANDIDATE_DISCOVERY=true
ENABLE_SERP_INTELLIGENCE=true
ENABLE_TREND_ENGINE=true
```

## Verify

```bash
pnpm typecheck
pnpm seo:validate
pnpm build
```

## Safety Rules

The system intentionally does not automate comment spam, forum/profile backlinks, community auto-posting, account creation, CAPTCHA bypass, proxy rotation, PBNs, directory spam, raw Google HTML scraping, or arbitrary redirect abuse.

SERP inputs use manual CSV or approved provider adapters. Competitor pages are summarized for structure, intent, gaps, and metadata; full copyrighted article bodies are not stored.

Affiliate APIs for AliExpress, Temu, Amazon, and iHerb are documented for later implementation only. Live integrations are disabled until credentials, policy review, and human approval workflows are ready.
