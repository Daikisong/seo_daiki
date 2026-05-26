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
  return staticCountryRiskGuideParamsFor("en-gb", "guides");
}

export function generateMetadata({ params }: PageProps) {
  return generateCountryRiskGuideMetadata(params, "en-gb", "guides");
}

export default async function UkCountryRiskGuidePage({ params }: PageProps) {
  const page = await loadCountryRiskGuidePage(params, "en-gb", "guides");
  return <ArticlePage {...page} />;
}
