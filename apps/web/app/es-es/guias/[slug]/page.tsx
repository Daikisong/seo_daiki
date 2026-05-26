import { ArticlePage } from "@/components/layout/ArticlePage";
import {
  generateCountryRiskGuideMetadata,
  loadCountryRiskGuidePage,
  staticCountryRiskGuideParamsFor
} from "@/lib/content/page-loaders";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return staticCountryRiskGuideParamsFor("es-es", "guias");
}

export function generateMetadata({ params }: PageProps) {
  return generateCountryRiskGuideMetadata(params, "es-es", "guias");
}

export default async function SpainCountryRiskGuidePage({ params }: PageProps) {
  const page = await loadCountryRiskGuidePage(params, "es-es", "guias");
  return <ArticlePage {...page} />;
}
