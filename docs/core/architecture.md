# Core Architecture

이 문서는 현재 `seo_daiki`의 실제 동작 기준 아키텍처를 정리한다. 핵심 목표는 하나다.

```text
국가별 트렌드 확인
  -> 상위 콘텐츠/SERP 구조 분석
  -> 글 전략 생성
  -> 웹사이트 테스트 게시
  -> 제품형 글만 상품 후보 분석
  -> 사람 승인 뒤 수익화
```

예를 들어 한국에서 `게이밍 모니터 추천`이 제품형 트렌드로 잡히면 리뷰/비교형 글이 생성되고, `KBO 올스타 팬투표`처럼 정보형 트렌드면 뉴스 글로 분기된다.

## Monorepo Layout

```text
apps/web
  Next.js App Router 웹사이트. 공개 페이지, 관리자 페이지, API route를 담당한다.

packages/db
  Prisma schema와 generated client. DB 모델의 원천이다.

packages/types
  MarketConfig, Article, Trend, SERP, Monetization 같은 공유 타입.

packages/seo
  canonical, hreflang, sitemap, JSON-LD helper.

packages/validators
  SEO/품질/제휴 링크/헬스 클레임 검증 규칙.

workers/python
  트렌드 수집, 클러스터링, SERP 분석, 글 전략, 제품 후보, 수익화 검토 CLI.

data
  config, seed, raw input, export 결과. 현재 샘플/테스트 게시물의 파일 기반 저장소 역할도 한다.

docs/core
  현재 아키텍처와 리팩토링 기준 문서.
```

## Runtime Flow

웹사이트의 market route는 다음 URL 구조를 따른다.

```text
/{market}/{language}/reviews/
/{market}/{language}/news/
/{market}/{language}/posts/{slug}/
```

예:

```text
/kr/ko/reviews/
/kr/ko/news/
/kr/ko/posts/게이밍-모니터-추천/
/jp/ja/reviews/
/de/de/news/
```

`/[locale]/[language]/posts/[slug]` route는 직접 화면을 만들지 않는다. 지금 기준 역할은 다음처럼 좁다.

```text
1. market 확인
2. slug로 post 찾기
3. post.contentBranch 확인
4. news면 MarketNewsPostDetail로 전달
5. review면 MarketReviewPostDetail로 전달
6. JSON-LD는 market-article-jsonld에서 생성
```

즉 라우트 파일은 교통정리만 하고, 실제 UI는 컴포넌트가 담당한다.

## Content Branches

현재 공개 독자용 콘텐츠는 크게 두 분기다.

```text
review
  구매/비교 의도가 있는 제품형 글.
  예: 게이밍 모니터 추천, Samsung S90F OLED 할인, iPhone 할인 비교.

news
  상품 링크가 자연스럽지 않은 정보형 트렌드 뉴스.
  예: KBO 팬투표 일정, 입시 정책, 정부 제도 변경.
```

이 분리는 SEO와 수익화 모두에 중요하다. 예를 들어 입시 정책 글에 무리하게 상품 링크를 넣으면 신뢰가 깨진다. 반대로 게이밍 모니터 글에는 비교표, 체크리스트, 제품 후보 분석이 자연스럽다.

뉴스 글은 공개 화면에서 내부 분석 패널을 보여주지 않는다. 필요한 확인 순서, 용어 설명, 주의점은 `sections` 본문 안에 문장으로 풀어 쓰고, 화면 하단에는 출처와 정정 안내만 둔다. 예를 들어 `교육공무원` 글은 “지원 전에 꼭 구분할 것”이라는 본문 섹션으로 설명하지, 별도 관리용 카드 묶음으로 노출하지 않는다.

## Article Page Modules

현재 글 상세 페이지는 다음 파일들로 나뉜다.

```text
apps/web/app/[locale]/[language]/posts/[slug]/page.tsx
  라우트, metadata, post branch 선택만 담당한다.

apps/web/components/market/MarketReviewPostDetail.tsx
  제품 리뷰/비교형 상세 화면을 렌더링한다.

apps/web/components/market/market-review-post-detail-model.ts
  리뷰 화면에 필요한 계산 로직을 담당한다.
  예: section anchor, quick answer, reader path, related links.

apps/web/components/market/market-review-post-detail-labels.ts
  리뷰 화면의 언어별 UI 문구를 담당한다.

apps/web/components/market/MarketNewsPostDetail.tsx
  뉴스/정보형 상세 화면을 렌더링한다.
  공개 흐름은 제목, 요점, 목차, 본문, 하단 출처/정정, 이전/다음 링크다.

apps/web/components/market/market-news-post-detail-model.ts
  뉴스 화면의 section id, 목차 section, key point fallback, paragraph split을 담당한다.

apps/web/components/market/market-news-post-detail-labels.ts
  뉴스 화면의 언어별 UI 문구를 담당한다.

apps/web/lib/market/market-article-jsonld.ts
  Article/NewsArticle/BreadcrumbList JSON-LD를 생성한다.
```

예를 들어 `빠른 체크리스트` 링크가 안 맞는 문제가 생기면 `MarketReviewPostDetail.tsx`와 `market-review-post-detail-model.ts`를 보면 된다. JSON-LD가 문제면 route 파일이 아니라 `market-article-jsonld.ts`를 본다.

## Shared Market UI Modules

상단 내비게이션과 시장 선택기는 여러 public market 화면에서 반복된다.

```text
apps/web/components/market/MarketArticleTopbar.tsx
  헤더 UI 렌더링만 담당한다.

apps/web/components/market/market-article-topbar-labels.ts
  헤더 브랜드, 메뉴, 검색, 구독, 국가/언어 문구를 담당한다.

apps/web/lib/market/market-language-names.ts
  market switcher에 표시할 언어명을 담당한다.
  예: us/en -> American English, gb/en -> British English, br/pt-br -> Português brasileiro.

apps/web/lib/market/market-sections.ts
  public market 섹션 목록과 섹션 검증을 담당한다.
  예: reviews, rankings, news, tips, community, search, subscribe.
```

예를 들어 `English`를 시장별로 더 구체적으로 보이게 바꾸려면 `MarketArticleTopbar.tsx`가 아니라 `market-language-names.ts`를 수정한다. 메뉴 문구를 바꾸려면 `market-article-topbar-labels.ts`를 수정한다.

## Market Section Modules

시장별 목록 페이지는 다음처럼 나뉜다.

```text
apps/web/app/[locale]/[language]/[section]/page.tsx
  route param 검증, buying-guide redirect, metadata만 담당한다.

apps/web/components/market/sections/MarketSectionPageContent.tsx
  섹션 페이지의 topbar, hero, footer, 섹션별 콘텐츠 분기를 담당한다.

apps/web/components/market/sections/MarketReviewSections.tsx
  상품 리뷰 목록과 랭킹 목록을 렌더링한다.

apps/web/components/market/sections/MarketNewsSection.tsx
  뉴스 목록을 렌더링한다.

apps/web/components/market/sections/MarketUtilitySections.tsx
  tips, community, search, subscribe 같은 보조 섹션을 렌더링한다.

apps/web/components/market/sections/market-section-copy.ts
  기존 import 경로를 유지하는 re-export 파일이다.

apps/web/components/market/sections/market-section-header-copy.ts
  섹션 hero와 empty state 문구를 담당한다.

apps/web/components/market/sections/market-review-section-copy.ts
  상품 리뷰 목록 문구를 담당한다.

apps/web/components/market/sections/market-news-section-copy.ts
  뉴스 목록 문구와 뉴스 empty state를 담당한다.

apps/web/components/market/sections/market-utility-section-copy.ts
  tips, community, search, subscribe 문구를 담당한다.
```

예를 들어 `/kr/ko/news/`에서 목록 UI가 이상하면 `MarketNewsSection.tsx`를 본다. `/jp/ja/reviews/`의 대표 리뷰 카드가 이상하면 `MarketReviewSections.tsx`를 본다. `reviews`가 유효한 섹션인지 같은 라우팅 규칙은 `market-sections.ts`를 본다.

## Worker Pipeline

worker CLI는 `workers/python/cli.py`에서 시작하지만, 실제 명령은 작은 parser/command 파일로 나뉜다.

```text
cli.py
  entrypoint

cli_parser.py
  명령 등록

cli_dispatch.py
  command handler로 전달

cli_trend_commands.py
cli_serp_commands.py
cli_content_commands.py
cli_product_commands.py
cli_monetization_commands.py
cli_pipeline_commands.py
  실제 명령 실행
```

기본 우선순위는 다음이다.

```text
pnpm pipeline:trend-to-post
  trend import/cluster/score
  SERP import/analyze
  strategy/brief/test article

pnpm pipeline:post-to-product-analysis
  제품형 글에만 상품 후보 분석

pnpm pipeline:monetization-review
  사람 승인 기반 수익화 검토
```

기본 파이프라인은 자동 수익 링크 삽입을 하지 않는다.

트렌드가 정보형 글인지 리뷰/비교형 글인지 나누는 로직은 별도 문서에 정리했다.

```text
docs/core/trend-monetization-routing.md
```

핵심 구조는 다음과 같다.

```text
trend_monetization_router.py
  route record facade

trend_monetization_constants.py
  route 이름과 buyer/product/informational/health 용어 사전

trend_monetization_signals.py
  신호 추출과 commerce/informational 점수 계산

trend_monetization_policy.py
  route별 allowed/blocked next steps와 localization policy

trend_monetization_matching.py
  article/opportunity/strategy 매칭
```

글 전략과 테스트 글 생성 로직은 별도 문서에 더 자세히 정리했다.

```text
docs/core/worker-content-strategy.md
```

핵심 구조는 다음과 같다.

```text
content_strategy_rules.py
  기존 import 경로를 유지하는 facade

content_strategy_topics.py
  topic key 판별

content_strategy_reader_sections.py
  독자가 읽는 본문 section과 summary

content_strategy_experience.py
  article experience facade

content_strategy_article_experience_records.py
  hero image, quick facts, checklist, comparison table, source links

content_strategy_serp_format_records.py
  article meta, key takeaways, verdict/pros-cons, SERP references

content_strategy_experience_helpers.py
  SEO readiness score, market internal links

content_strategy_localization.py
  언어별 gap/evidence/competitor 문장화
```

## SEO Boundary

SEO 관련 책임은 분리되어 있다.

```text
packages/seo
  canonical, hreflang, sitemap, JSON-LD helper

apps/web/lib/seo/metadata.ts
  Next metadata 변환

apps/web/lib/seo/market-index-policy.ts
  market home sitemap/index 정책

scripts/seo-market-audit.ts
  market route, hreflang, sitemap, noindex 정책 점검

scripts/seo-article-quality-audit.ts
  공개 글 상세 화면과 test_articles.json 품질 점검
```

예를 들어 `NEXT_PUBLIC_SITE_URL`이나 canonical 문제가 생기면 `packages/seo`와 `apps/web/lib/seo`를 먼저 본다. 글 화면 컴포넌트에서 canonical을 만들지 않는다.

글 상세 화면의 실제 SEO 품질 검사는 별도 문서에 정리했다.

```text
docs/core/seo-quality-audits.md
```

예를 들어 `MarketReviewPostDetail.tsx`를 쪼개거나 CSS 파일을 추가하면 `scripts/seo-article-quality/paths.ts`의 검사 대상 파일 목록도 같이 갱신해야 한다. route 파일 하나만 검사하면 실제 렌더러 구조를 놓친다.

## Research Scripts

프론트 형식/SEO 품질을 검증하기 위한 리서치 스크립트는 별도 문서에 정리했다.

```text
docs/core/research-scripts.md
```

핵심 예시는 다음이다.

```text
scripts/generate-live-trending-frontend-research.ts
  실행 entrypoint. RSS snapshot과 seed를 매칭하고 JSON/Markdown 산출물을 쓴다.

scripts/live-trending-frontend/seeds.ts
  100개 이상 상위/대표 페이지 관찰 seed와 반복 frontend pattern을 보관한다.
```

예를 들어 상위 사이트 관찰 목록을 바꾸고 싶으면 `seeds.ts`를 고치고, 출력 문서 형식을 바꾸고 싶으면 `generate-live-trending-frontend-research.ts`를 고친다.

## Refactoring Rules

앞으로 리팩토링할 때 지켜야 할 기준:

```text
1. 라우트 파일은 데이터 선택과 branch 결정만 담당한다.
2. 화면 컴포넌트는 렌더링만 담당한다.
3. 화면 계산은 model 파일로 뺀다.
4. 언어별 문구는 labels 파일로 뺀다.
5. SEO 구조화 데이터는 lib/market 또는 packages/seo에 둔다.
6. 기능이 바뀌면 리팩토링이 아니라 기능 변경으로 취급한다.
7. 리팩토링 후에는 최소 pnpm typecheck, 가능하면 pnpm build를 돌린다.
```

좋은 예:

```text
page.tsx
  post가 news인지 review인지 고른다.

MarketReviewPostDetail.tsx
  화면을 그린다.

market-review-post-detail-model.ts
  quick nav와 related links를 만든다.
```

나쁜 예:

```text
page.tsx 안에서
  HTML 전체 렌더링
  라벨 번역
  JSON-LD 생성
  anchor 계산
  mailto 생성
  CSS 구조 가정
을 모두 처리한다.
```

## Current Known Debt

CSS는 전역 class 이름을 유지한 상태에서 파일을 나눴다. class 이름을 바꾸지 않았기 때문에 컴포넌트 동작과 DOM 구조는 그대로다.

```text
apps/web/app/globals.css
  reset, CSS variables, base element style만 담당한다.

apps/web/app/styles/market-shell-and-sections.css
  public market topbar, section home, review/news list, search/subscribe form의 기본 스타일을 담당한다.

apps/web/app/styles/market-article-detail.css
  review/article detail 본문, hero, source, table, side rail, responsive 기본 스타일을 담당한다.

apps/web/app/styles/market-public-overrides.css
  실제 공개 화면 품질 조정을 위한 최종 override를 담당한다.
```

현재 import 순서는 원래 cascade 순서를 보존하기 위해 다음처럼 유지한다.

```ts
import "./globals.css";
import "./styles/market-shell-and-sections.css";
import "./styles/market-article-detail.css";
import "./styles/market-public-overrides.css";
```

예를 들면 원래 `globals.css` 안에서 `기본값 -> 목록/뉴스 -> 글 상세 -> 최종 오버라이드` 순서로 적용되던 스타일을 파일만 나눴다. 그래서 `.market-article-topbar`의 기본값은 `market-shell-and-sections.css`에 있고, 더 강한 최종 조정은 `market-public-overrides.css`에 있다.

다음 단계에서는 스크린샷 비교가 가능한 상태에서 CSS Module로 옮기는 것이 좋다.

```text
MarketArticleTopbar.module.css
MarketReviewPostDetail.module.css
MarketNewsPostDetail.module.css
MarketSection.module.css
```

다만 CSS module 분리는 화면 차이가 날 가능성이 크므로 별도 단계에서 스크린샷 비교와 함께 진행해야 한다.
