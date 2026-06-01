# Research Script Architecture

이 문서는 프론트/SEO 리서치용 TypeScript 스크립트 구조를 설명한다.

## Live Trending Frontend Research

명령:

```bash
pnpm research:live-frontend
```

역할:

```text
실제 Google Trends RSS snapshot
  -> 시장별 frontend-relevant trend group seed와 매칭
  -> 각 trend group의 상위/대표 페이지 관찰 데이터 조립
  -> data/research JSON과 docs markdown 생성
```

파일 구조:

```text
scripts/generate-live-trending-frontend-research.ts
  실행 entrypoint다.
  snapshot을 읽고, seed와 RSS evidence를 매칭하고, JSON/Markdown 산출물을 쓴다.

scripts/live-trending-frontend/seeds.ts
  정적 리서치 seed 데이터다.
  TopSiteSeed, GroupSeed, repeatedPatterns, groups를 제공한다.
```

예를 들어 100개 상위 사이트 리서치 대상 URL을 바꾸고 싶다면 `seeds.ts`를 수정한다. 출력 파일 경로나 Markdown 문서 형식을 바꾸고 싶다면 `generate-live-trending-frontend-research.ts`를 수정한다.

## Output

```text
data/research/live-trending-frontend-top-sites-2026-05-31.json
docs/live-trending-100-frontend-format-analysis.md
```

이 산출물은 public page에 그대로 노출하는 콘텐츠가 아니다. 프론트 구조, 여백, 표, 체크리스트, 출처 배치 같은 형식 판단 근거로 사용한다.

## Verification

최소 검증:

```bash
pnpm research:live-frontend
pnpm typecheck
```

프론트 품질 점수나 SEO validator가 이 리서치 산출물을 참조할 수 있으므로, 관련 변경 뒤에는 다음도 실행한다.

```bash
pnpm seo:validate
pnpm build
```
