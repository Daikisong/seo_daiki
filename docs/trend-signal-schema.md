# Trend Signal Schema

Core fields:

- `market`
- `language`
- `country`
- `rawKeyword`
- `normalizedKeyword`
- `topicRaw`
- `categoryGuess`
- `observedAt`
- `sourceRank`
- `sourceVolumeBucket`
- `relativeGrowth`
- `velocityScore`
- `freshnessScore`
- `commercialHintScore`
- `evidenceHintScore`
- `localeSpecificityScore`
- `rawJson`

Example:

```json
{
  "market": "us",
  "language": "en",
  "country": "US",
  "rawKeyword": "magnesium glycinate sleep",
  "normalizedKeyword": "magnesium glycinate sleep",
  "topicRaw": "magnesium sleep",
  "sourceVolumeBucket": "high",
  "relativeGrowth": 88
}
```

The key rule: a topic can trend in one market and not another.
