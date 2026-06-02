# Architecture

현재 상세 아키텍처의 기준 문서는 [`docs/core/architecture.md`](core/architecture.md)다.

이 파일은 새로 들어오는 에이전트가 큰 방향을 빠르게 잡기 위한 요약이다.

## Current Product Model

`seo_daiki`는 지금 “제휴 자동 블로그”가 아니라 다음 흐름을 가진 시장별 트렌드 콘텐츠 시스템이다.

```text
국가별 트렌드 확인
  -> SERP/상위 콘텐츠 형식 분석
  -> review 또는 news 분기
  -> 웹사이트 테스트 게시
  -> 제품형 글만 상품 후보 분석
  -> 사람 승인 뒤 수익 링크 삽입
```

예:

```text
게이밍 모니터 추천
  -> review
  -> 비교표, 체크리스트, 제품 후보 분석

교육공무원 확인사항
  -> news
  -> 본문 중심 정보 글, 하단 출처, 수익화 없음
```

## Public Routes

```text
/{market}/{language}/reviews/
/{market}/{language}/news/
/{market}/{language}/posts/{slug}/
```

예:

```text
/kr/ko/reviews/
/kr/ko/news/
/kr/ko/posts/교육공무원-2026-확인사항/
/jp/ja/reviews/
/de/de/news/
```

## Frontend Ownership

```text
apps/web/app/[locale]/[language]/posts/[slug]/page.tsx
  라우트, metadata, branch 결정.

apps/web/components/market/MarketReviewPostDetail.tsx
  제품 리뷰/비교형 상세 페이지.

apps/web/components/market/MarketNewsPostDetail.tsx
  정보형 뉴스 상세 페이지.

apps/web/components/market/sections/
  reviews, news, rankings, tips, community 같은 market section 페이지.

apps/web/lib/market/
  market 데이터 읽기, JSON-LD, market helper.
```

## News Page Boundary

뉴스 페이지는 기사처럼 보여야 한다. 내부 분석 도구처럼 보이면 안 된다.

현재 공개 뉴스 구조:

```text
제목/요약
이 글의 요점
목차
본문
하단 출처와 정정
이전/다음 글
```

필요한 확인 순서나 용어 설명은 본문에 자연스럽게 쓴다. 별도 관리용 패널을 public UI에 다시 추가하지 않는다.

## Worker And Data

```text
workers/python
  트렌드, SERP, 전략, 제품 후보, 수익화 검토 CLI.

data/config
  market 설정과 UI label.

data/exports
  현재 로컬 테스트 글, 리포트, 샘플 export.
```

## Validation

현재 handoff 전에 우선 돌려야 하는 명령:

```text
pnpm typecheck
pnpm seo:article-quality
pnpm seo:market-audit
pnpm build
```

`pnpm seo:article-quality`는 공개 글 화면에 내부 작업 문구나 뉴스 관리용 패널이 다시 노출되는지 검사한다.

## More Detail

```text
docs/core/architecture.md
docs/core/korean-news-posting-template.md
docs/core/trend-monetization-routing.md
docs/core/seo-quality-audits.md
docs/todo.md
```
