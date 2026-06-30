import type { Article } from "./types";
import { articlePath } from "./routes";

export type TrendAuthor = {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
  shortBio: string;
  longBio: string;
  expertiseAreas: string[];
  coveredCategories: string[];
  localeCoverage: string[];
  methodologyNote: string;
  sameAs: string[];
  authorPagePath: string;
  publicProfile: boolean;
  latestArticles: string[];
  evidenceNote: string;
};

export const trendAuthors = [
  {
    id: "jacob",
    name: "Jacob",
    role: "Marketplace Research Editor",
    avatarInitials: "J",
    shortBio:
      "Jacob turns fast-moving product trends into practical buyer notes.",
    longBio:
      "Jacob focuses on marketplace routes, exact model variants, price checks, seller terms, repeated buyer complaints, and the point where a trend becomes a real buying decision.",
    expertiseAreas: [
      "Marketplace product routes",
      "Exact variant and model checks",
      "Price, stock, warranty, and return risk",
      "Repeated buyer-review complaint patterns",
      "Trend-to-buyer-problem mapping",
    ],
    coveredCategories: ["Home Briefs"],
    localeCoverage: ["en"],
    methodologyNote:
      "Jacob uses checkable public specs, merchant listings, current prices, source reviews, and buyer-review patterns to make the buying decision clearer.",
    sameAs: [],
    authorPagePath: "/authors/jacob/",
    publicProfile: true,
    latestArticles: [],
    evidenceNote:
      "Briefs tie practical observations to exact variants, source labels, price dates, review patterns, and return-path notes so the buying case stays checkable.",
  },
  {
    id: "trendbrief-editors",
    name: "TrendBrief Editors",
    role: "Editorial Desk",
    avatarInitials: "TB",
    shortBio:
      "TrendBrief Editors maintain the Brief standard and evidence language.",
    longBio:
      "The editorial desk keeps Briefs focused on source-backed product evidence, affiliate disclosure placement, region fit, and buyer outcomes instead of internal process.",
    expertiseAreas: [
      "Evidence labels and editorial standards",
      "Affiliate disclosure placement",
      "Locale and region-fit checks",
      "Source-backed product notes",
      "Brief structure and update standards",
    ],
    coveredCategories: ["All public TrendBrief categories"],
    localeCoverage: ["en"],
    methodologyNote:
      "The desk checks that a Brief shows useful buyer-facing evidence: specs, source reviews, marketplace route, price checked date, repeated complaints, and return path.",
    sameAs: [],
    authorPagePath: "/authors/trendbrief-editors/",
    publicProfile: true,
    latestArticles: [],
    evidenceNote:
      "Briefs use plain source labels, price dates, review patterns, and return-path notes so readers can check the recommendation quickly.",
  },
] as const satisfies readonly TrendAuthor[];

export const publicTrendAuthors = trendAuthors.filter(
  (author) => author.publicProfile,
);

export function getTrendAuthorById(id: string | undefined) {
  if (!id) {
    return undefined;
  }
  return trendAuthors.find((author) => author.id === id);
}

export function authorArticles(author: TrendAuthor, articles: Article[]) {
  return articles.filter(
    (article) =>
      article.authorId === author.id ||
      article.productEvidenceById === author.id ||
      article.editedById === author.id,
  );
}

export function latestAuthorArticles(author: TrendAuthor, articles: Article[]) {
  return authorArticles(author, articles)
    .slice()
    .sort((a, b) => Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated));
}

export function authorArticlePath(article: Article) {
  return articlePath(article);
}
