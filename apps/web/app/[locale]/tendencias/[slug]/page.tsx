import { ArticlePage } from "@/components/layout/ArticlePage";
import {
  generateArticleMetadata,
  loadArticlePageForLocalizedSection,
  staticParamsForLocalizedSection
} from "@/lib/content/page-loaders";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<{ previewToken?: string | string[] }>;
}

export function generateStaticParams() {
  return staticParamsForLocalizedSection("trend", "tendencias");
}

export function generateMetadata({ params, searchParams }: PageProps) {
  return generateArticleMetadata(params, "trend", searchParams);
}

export default async function TrendPage({ params, searchParams }: PageProps) {
  const page = await loadArticlePageForLocalizedSection(params, "trend", "tendencias", searchParams);
  return <ArticlePage {...page} />;
}
