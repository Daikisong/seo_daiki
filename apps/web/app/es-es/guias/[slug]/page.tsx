import { ArticlePage } from "@/components/layout/ArticlePage";
import {
  generateCountryRiskGuideMetadata,
  loadCountryRiskGuidePage,
  staticCountryRiskGuideParamsFor
} from "@/lib/content/page-loaders";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ previewToken?: string | string[] }>;
}

export function generateStaticParams() {
  return staticCountryRiskGuideParamsFor("es-es", "guias");
}

export function generateMetadata({ params, searchParams }: PageProps) {
  return generateCountryRiskGuideMetadata(params, "es-es", "guias", searchParams);
}

export default async function SpainCountryRiskGuidePage({ params, searchParams }: PageProps) {
  const page = await loadCountryRiskGuidePage(params, "es-es", "guias", searchParams);
  return <ArticlePage {...page} />;
}
