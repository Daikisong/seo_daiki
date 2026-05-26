import { ArticlePage } from "@/components/layout/ArticlePage";
import { generateArticleMetadata, loadGuidePageForSection, staticParamsFor } from "@/lib/content/page-loaders";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<{ previewToken?: string | string[] }>;
}

export function generateStaticParams() {
  return staticParamsFor("guide");
}

export function generateMetadata({ params, searchParams }: PageProps) {
  return generateArticleMetadata(params, "guide", searchParams);
}

export default async function GuidePage({ params, searchParams }: PageProps) {
  const page = await loadGuidePageForSection(params, "guides", searchParams);
  return <ArticlePage {...page} />;
}
