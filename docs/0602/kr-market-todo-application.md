# KR Market TODO Application

Date: 2026-06-02

This run applied the first TODO item to the Korean market only, then corrected the public news page shape after review.

## Selected Market

```text
market: kr
language: ko
path: /kr/ko/
```

## Current Topic

```text
title: 교육공무원 2026: 채용·복무·보수 확인 전에 볼 공식 경로
slug: 교육공무원-2026-확인사항
branch: news
monetization: deferred
```

Local URL:

```text
http://localhost:3000/kr/ko/posts/%EA%B5%90%EC%9C%A1%EA%B3%B5%EB%AC%B4%EC%9B%90-2026-%ED%99%95%EC%9D%B8%EC%82%AC%ED%95%AD/
```

## Public Shape Decision

The Korean `news` detail page should read like an article, not like an internal operations dashboard.

Current public flow:

```text
title and summary
key points
table of contents
article body
bottom sources and correction note
previous/next links
```

Removed from the public page:

```text
extra top utility panels
separate reader-segmentation cards
separate Q&A cards
separate glossary cards
separate mistake-list cards
```

쉽게 말하면, 독자에게 필요한 확인 순서는 본문 문장으로 쓰고, 편집자가 보는 관리용 카드처럼 따로 노출하지 않는다.

## Data Cleanup

The public `news` data contract now uses only the normal article fields:

```text
title
summary
sections
heroImage
articleMeta
keyTakeaways
sourceLinks
internalLinks
contentBranch
monetizationRoute
indexStatus
publishStatus
```

The old public utility-panel fields were removed from:

```text
MarketPostView
readMarketPosts()
MarketNewsPostDetail helpers
news detail labels
Korean test article export
article quality type/scoring input
public CSS
```

## Verification Target

The quality check now treats this as a regression:

```text
news page must not render dashboard-like utility panel classes
news page must not serialize removed utility-panel data into client props
news page must keep source/correction at the bottom
```

## Next Expansion Rule

When another market gets a `news` article:

```text
1. Confirm the trend and branch.
2. If it is informational, write an article body with clear sections.
3. Keep official/public source links at the bottom.
4. Keep internal trend/SERP/editorial state out of public UI.
5. Run article quality and market audit before handoff.
```

For product or buying-intent topics, use the `review` branch instead.
