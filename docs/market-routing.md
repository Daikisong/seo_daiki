# Market Routing

The site uses one domain with market/language silos:

```text
/us/en/
/gb/en/
/ca/en/
/au/en/
/es/es/
/mx/es/
/br/pt-br/
/pt/pt/
/fr/fr/
/de/de/
/it/it/
/nl/nl/
/pl/pl/
/tr/tr/
/id/id/
/jp/ja/
/kr/ko/
/in/en/
```

Each market config lives in `data/config/markets.json`.

Market routes:

- `/[market]/[language]/`
- `/[market]/[language]/trends/[slug]/`
- `/[market]/[language]/keywords/[slug]/`
- `/[market]/[language]/serp/[slug]/`
- `/[market]/[language]/briefs/[slug]/`
- `/[market]/[language]/posts/[slug]/`
- `/[market]/[language]/calendar/`

Legacy routes redirect temporarily:

- `/en` -> `/us/en/`
- `/es` -> `/es/es/`
- `/pt-br` -> `/br/pt-br/`

There is no IP redirect. Users and crawlers get explicit URLs.
