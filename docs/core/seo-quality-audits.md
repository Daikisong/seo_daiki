# SEO Quality Audits

이 문서는 공개 글 품질 검사 스크립트의 현재 구조를 설명한다.

핵심 역할은 다음이다.

```text
test_articles.json
  -> 글 데이터 점수 검사
  -> article renderer/CSS 정적 검사
  -> 실제 로컬 URL HTML 검사
  -> 상위 SEO/프론트 리서치 증거 검사
  -> data/exports/seo_article_quality_report.json
```

예를 들어 리뷰 상세 화면을 `MarketReviewPostDetail.tsx`로 분리했으면, 검사 스크립트도 `page.tsx` 하나만 보면 안 된다. 라우트 파일은 이제 교통정리만 하므로 실제 DOM class, 표, 출처, 목차, JSON-LD는 여러 파일에 흩어져 있다.

## Entrypoint

```text
scripts/seo-article-quality-audit.ts
```

이 파일은 얇은 실행 파일이다.

```text
1. 검사 대상 파일 경로를 읽는다.
2. 글 데이터 점수를 계산한다.
3. renderer/CSS 정적 검사를 실행한다.
4. 실제 로컬 URL을 curl로 확인한다.
5. 리서치 파일 존재와 규모를 확인한다.
6. 리포트를 쓰고 실패하면 에러를 낸다.
```

기능 로직은 아래 모듈로 나뉜다.

## Modules

```text
scripts/seo-article-quality/types.ts
  Article, AuditCheck, WeightedAuditCheck 타입.

scripts/seo-article-quality/paths.ts
  검사 대상 경로와 source reader.
  split renderer/CSS 파일 목록도 여기서 관리한다.

scripts/seo-article-quality/article-scoring.ts
  개별 글 데이터 품질 점수.
  hero image, metadata, checklist, comparison table, source links, noindex 상태 등을 본다.

scripts/seo-article-quality/static-source-checks.ts
  컴포넌트/CSS 정적 검사.
  예: review summary class가 있는지, right rail이 숨김 처리됐는지, responsive rule이 있는지.

scripts/seo-article-quality/rendered-route-checks.ts
  실제 로컬 URL HTML 검사.
  예: /kr/ko/posts/... 가 review/news HTML을 렌더링하는지 curl로 확인한다.

scripts/seo-article-quality/research-readers.ts
  상위 SEO 형식 분석 JSON과 live frontend research JSON을 읽고 요약한다.
```

## Why It Reads Multiple Files

이전 구조에서는 상세 페이지 대부분이 route 파일 하나에 있었다.

```text
apps/web/app/[locale]/[language]/posts/[slug]/page.tsx
```

지금은 책임이 나뉘었다.

```text
page.tsx
  post branch 선택과 metadata.

MarketReviewPostDetail.tsx
  리뷰형 상세 화면.

MarketNewsPostDetail.tsx
  뉴스형 상세 화면.

market-review-post-detail-model.ts
  리뷰 화면 계산 로직.

market-news-post-detail-model.ts
  뉴스 화면 계산 로직.

market-article-jsonld.ts
  Article/NewsArticle JSON-LD.

market-article-detail.css
  글 상세 CSS.

market-public-overrides.css
  공개 화면 최종 보정 CSS.
```

그래서 `paths.ts`의 `articleRendererSourcePaths`와 `articleCssSourcePaths`는 여러 파일을 합쳐서 검사한다.

예를 들어 `comparison table` 검사는 route 파일이 아니라 `MarketReviewPostDetail.tsx`에서 통과한다. `right rail hidden` 검사는 `market-article-detail.css`의 최종 CSS에서 통과한다.

## Command

```bash
pnpm seo:article-quality
```

이 명령은 로컬 사이트 HTML도 확인한다. 따라서 `http://localhost:3000` 개발 서버가 떠 있어야 route 검사가 의미 있다.

통과하면 다음 파일이 갱신된다.

```text
data/exports/seo_article_quality_report.json
```

## Refactoring Rule

앞으로 상세 페이지를 더 쪼개면 `paths.ts`의 source path 목록도 같이 업데이트해야 한다.

예:

```text
새 컴포넌트 MarketProductComparisonTable.tsx를 만들었다
  -> articleRendererSourcePaths에 추가

글 상세 CSS를 MarketReviewPostDetail.module.css로 옮겼다
  -> articleCssSourcePaths에 추가
```

검사 기준 자체가 바뀌지 않았는데 `seo:article-quality`가 깨진다면, 먼저 source path 목록이 최신 구조를 따라가고 있는지 확인한다.
