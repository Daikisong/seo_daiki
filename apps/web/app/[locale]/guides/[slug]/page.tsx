import { ArticlePage } from "@/components/layout/ArticlePage";
import { generateArticleMetadata, loadGuidePageForSection, staticParamsFor } from "@/lib/content/page-loaders";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return staticParamsFor("guide");
}

export function generateMetadata({ params }: PageProps) {
  return generateArticleMetadata(params, "guide");
}

export default async function GuidePage({ params }: PageProps) {
  const page = await loadGuidePageForSection(params, "guides");
  return <ArticlePage {...page} />;
}
