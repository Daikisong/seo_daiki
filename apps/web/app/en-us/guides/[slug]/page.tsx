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
  return staticCountryRiskGuideParamsFor("en-us", "guides");
}

export function generateMetadata({ params }: PageProps) {
  return generateCountryRiskGuideMetadata(params, "en-us", "guides");
}

export default async function UsCountryRiskGuidePage({ params }: PageProps) {
  const page = await loadCountryRiskGuidePage(params, "en-us", "guides");
  return <ArticlePage {...page} />;
}
