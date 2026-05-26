import { ArticlePage } from "@/components/layout/ArticlePage";
import { generateArticleMetadata, loadReviewPageForSection, staticReviewParamsForSection } from "@/lib/content/page-loaders";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<{ previewToken?: string | string[] }>;
}

export function generateStaticParams() {
  return staticReviewParamsForSection("reviews");
}

export function generateMetadata({ params, searchParams }: PageProps) {
  return generateArticleMetadata(params, "review", searchParams);
}

export default async function ReviewPage({ params, searchParams }: PageProps) {
  const page = await loadReviewPageForSection(params, "reviews", searchParams);
  return <ArticlePage {...page} />;
}
