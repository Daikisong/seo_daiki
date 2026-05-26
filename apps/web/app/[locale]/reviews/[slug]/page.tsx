import { ArticlePage } from "@/components/layout/ArticlePage";
import { generateArticleMetadata, loadReviewPageForSection, staticReviewParamsForSection } from "@/lib/content/page-loaders";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return staticReviewParamsForSection("reviews");
}

export function generateMetadata({ params }: PageProps) {
  return generateArticleMetadata(params, "review");
}

export default async function ReviewPage({ params }: PageProps) {
  const page = await loadReviewPageForSection(params, "reviews");
  return <ArticlePage {...page} />;
}
