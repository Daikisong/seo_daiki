# Live Country Trend Research - 2026-05-31

This run did not start from preselected sample topics. It started from country-level Google Trends RSS snapshots and then selected article candidates.

Source snapshot:

- `data/raw/google-trends-rss-snapshot-2026-05-31.json`

Selection record:

- `data/raw/live-country-trend-selection-2026-05-31.json`

## Method

1. Capture Google Trends public RSS per enabled country.
2. Review the country list before choosing topics.
3. Exclude terms that are poor test-post fits: live sports results, lottery checks, political-personality controversy, celebrity gossip, and accident/death terms.
4. Select durable informational or consumer-decision trends.
5. Build manual SERP records from real source URLs.
6. Generate noindex test posts only after trend and SERP evidence exists.

## Selected Topics

| Market | RSS trend | Selected topic | Why selected |
| --- | --- | --- | --- |
| US/en | `samsung oled 4k s90f smart tv` | `samsung s90f oled deal` | Real US consumer-tech trend with review and deal intent. |
| ES/es | `agencia tributaria renta 2025` | `renta 2025 avisos aeat` | Real Spain public-service trend around tax campaign notices. |
| BR/pt-br | `iphone 16` | `iphone 16 promocao brasil` | Real Brazil consumer-tech trend tied to a current price/deal question. |
| JP/ja | `アイフォン` | `iphone 18 rumors japan` | Real Japan iPhone trend tied to iPhone 18 rumor coverage. |
| KR/ko | `게임` | `게이밍 모니터 추천` | Real Korea education trend tied to admissions policy and gaming monitor buying intent. |

## Guardrails

- No raw Google Search HTML scraping.
- No affiliate links in test posts.
- No invented prices, legal outcomes, medical outcomes, or first-hand testing.
- Price/deal topics require freshness checks before any public indexable article.
- Tax, education, and policy topics require official-source checks and conservative wording.
