import { ArticlePage } from "@/components/layout/ArticlePage";
import { generateArticleMetadata, loadReviewPageForSection, staticReviewParamsForSection } from "@/lib/content/page-loaders";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return staticReviewParamsForSection("resenas");
}

export function generateMetadata({ params }: PageProps) {
  return generateArticleMetadata(params, "review");
}

export default async function SpanishReviewPage({ params }: PageProps) {
  const page = await loadReviewPageForSection(params, "resenas");
  return <ArticlePage {...page} />;
}
