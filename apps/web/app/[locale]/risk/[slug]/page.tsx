import { ArticlePage } from "@/components/layout/ArticlePage";
import { generateArticleMetadata, loadLegacyRiskPage, staticParamsFor } from "@/lib/content/page-loaders";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return staticParamsFor("risk");
}

export function generateMetadata({ params }: PageProps) {
  return generateArticleMetadata(params, "risk");
}

export default async function RiskPage({ params }: PageProps) {
  const page = await loadLegacyRiskPage(params);
  return <ArticlePage {...page} />;
}
