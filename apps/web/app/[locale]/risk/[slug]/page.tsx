import { ArticlePage } from "@/components/layout/ArticlePage";
import { generateArticleMetadata, loadLegacyRiskPage, staticParamsFor } from "@/lib/content/page-loaders";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<{ previewToken?: string | string[] }>;
}

export function generateStaticParams() {
  return staticParamsFor("risk");
}

export function generateMetadata({ params, searchParams }: PageProps) {
  return generateArticleMetadata(params, "risk", searchParams);
}

export default async function RiskPage({ params, searchParams }: PageProps) {
  const page = await loadLegacyRiskPage(params, searchParams);
  return <ArticlePage {...page} />;
}
