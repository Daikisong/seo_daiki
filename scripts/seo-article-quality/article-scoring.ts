import type { Article, WeightedAuditCheck } from "./types";

const forbiddenVisiblePhrases = [
  "test_published",
  "상품 후보",
  "수익화 보류",
  "Website Test Post",
  "Product candidate",
  "selected from country-level",
  "prefilled topic",
  "manual SERP",
  "수동 SERP",
  "뉴스를",
  "Index-ready",
  "Ready after editor",
  "editor checks",
  "공개 준비",
  "SERP 분석",
  "Trend signal",
  "트렌드 신호",
  "상위 글",
  "검색 글",
  "El formato",
  "formato más útil",
  "formato mas util",
  "The winning format",
  "上位の噂まとめ",
  "미리 정한 예시",
  "국가별 트렌드 확인 뒤"
];

export function scoreArticle(article: Article) {
  const checks: WeightedAuditCheck[] = [];
  const add = (name: string, pass: boolean, points: number) => checks.push({ name, pass, points });
  const visibleText = visibleArticleText(article);
  const wordLikeCount = visibleText.split(/\s+/).filter(Boolean).length;
  const cjkLength = (visibleText.match(/[가-힣ぁ-んァ-ン一-龥]/g) ?? []).length;

  add("hero image with alt and caption", Boolean(article.heroImage?.src && article.heroImage?.alt && article.heroImage?.caption), 8);
  add("article metadata", Boolean(article.articleMeta?.checkedAt && article.articleMeta?.readingTime && article.articleMeta?.basis), 6);
  add("summary is reader-facing", Boolean(article.summary && article.summary.length >= 80), 6);
  add("at least six body sections", (article.sections ?? []).length >= 6, 6);
  add("first section gives the answer early", Boolean(article.sections?.[0]?.heading && article.sections?.[0]?.body), 4);
  add("substantial body length", wordLikeCount >= 450 || cjkLength >= 850, 6);
  add("reviewer and checked date", Boolean(article.articleMeta?.checkedAt && article.articleMeta?.reviewer), 8);
  add("key takeaways", (article.keyTakeaways ?? []).length >= 3, 7);
  add("verdict box", Boolean(article.verdictBox?.label && article.verdictBox?.body), 6);
  add("quick facts", (article.quickFacts ?? []).length >= 3, 5);
  add("checklist UI data", (article.checklist ?? []).length >= 5, 6);
  add("comparison table", Boolean((article.comparisonTable?.columns ?? []).length >= 3 && (article.comparisonTable?.rows ?? []).length >= 3), 7);
  add("official policy sources lead official-policy topics", officialPolicySourcesLead(article), 4);
  add(
    "source links with checked date",
    (article.sourceLinks ?? []).length >= 3 &&
      (article.sourceLinks ?? []).every((source) => source.label && source.url?.startsWith("http") && source.note && source.checkedAt),
    12
  );
  add("no visible internal workflow phrasing", !forbiddenVisiblePhrases.some((phrase) => visibleText.includes(phrase)), 6);
  add("localized visible support text", localizedVisibleTextPass(article, visibleText), 5);
  add("safe monetization state", article.monetizationDeferred === true && Array.isArray(article.affiliateLinks) && article.affiliateLinks.length === 0, 2);
  add("test post remains noindex until promotion", article.indexStatus === "noindex", 2);

  const rawScore = checks.reduce((total, check) => total + (check.pass ? check.points : 0), 0);
  const score = Math.min(rawScore, 100);
  return { slug: article.slug, score, checks };
}

function visibleArticleText(article: Article): string {
  return [
    article.title,
    article.summary,
    ...(article.sections ?? []).flatMap((section) => [section.heading, section.body]),
    ...(article.keyTakeaways ?? []),
    ...(article.quickFacts ?? []).flatMap((fact) => {
      if (fact && typeof fact === "object" && "label" in fact && "value" in fact) {
        return [String(fact.label), String(fact.value)];
      }
      return [];
    }),
    ...(article.checklist ?? []),
    ...(article.sourceLinks ?? []).flatMap((source) => [source.label, source.note])
  ].join(" ");
}

function localizedVisibleTextPass(article: Article, visibleText: string): boolean {
  if ((article.language ?? "en") === "en") {
    return true;
  }
  const englishWorkflowFragments = [
    "Best for",
    "Main risk",
    "Must verify",
    "Index-ready",
    "Ready after",
    "The winning format",
    "Top rumor roundups",
    "Official campaign",
    "Trend/deal source",
    "Buying-threshold context",
    "Guide-style roundup",
    "Search top",
    "상위 검색",
    "상위 글",
    "검색 글",
    "블로그형",
    "편집 큐",
    "Global trend map",
    "El formato",
    "formato más útil",
    "formato mas util",
    "上位の噂まとめ"
  ];
  return !englishWorkflowFragments.some((phrase) => visibleText.includes(phrase));
}

function officialPolicySourcesLead(article: Article): boolean {
  const topicText = `${article.slug ?? ""} ${article.title ?? ""} ${article.summary ?? ""}`.toLowerCase();
  const isPolicyTopic = /학폭|대입|renta|hacienda|aeat|avisos/.test(topicText);
  if (!isPolicyTopic) {
    return true;
  }
  const firstSourceUrl = article.sourceLinks?.[0]?.url ?? "";
  return /agenciatributaria\.gob\.es|hacienda\.gob\.es|kcue\.or\.kr|korea\.kr|adiga\.kr/i.test(firstSourceUrl);
}
