import { ArticlePage } from "@/components/layout/ArticlePage";
import { generateArticleMetadata, loadReviewPageForSection, staticReviewParamsForSection } from "@/lib/content/page-loaders";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<{ previewToken?: string | string[] }>;
}

export function generateStaticParams() {
  return staticReviewParamsForSection("resenas");
}

export function generateMetadata({ params, searchParams }: PageProps) {
  return generateArticleMetadata(params, "review", searchParams);
}

export default async function SpanishReviewPage({ params, searchParams }: PageProps) {
  const page = await loadReviewPageForSection(params, "resenas", searchParams);
  return <ArticlePage {...page} />;
}
