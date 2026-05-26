import { ArticlePage } from "@/components/layout/ArticlePage";
import { regionalRiskRouteForPath } from "@global-import-lab/seo";
import {
  generateFixedLocaleGuideMetadata,
  generateCountryRiskGuideMetadata,
  loadCountryRiskGuidePage,
  loadGuidePageForFixedLocale,
  staticCountryRiskGuideParamsFor,
  staticGuideParamsForSection
} from "@/lib/content/page-loaders";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const params = [...(await staticCountryRiskGuideParamsFor("pt-br", "guias")), ...(await staticGuideParamsForSection("pt-br"))];
  return Array.from(new Map(params.map((param) => [param.slug, param])).values());
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (regionalRiskRouteForPath("pt-br", "guias", slug)) {
    return generateCountryRiskGuideMetadata(Promise.resolve({ slug }), "pt-br", "guias");
  }

  return generateFixedLocaleGuideMetadata(Promise.resolve({ slug }), "pt-br");
}

export default async function BrazilCountryRiskGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const page = regionalRiskRouteForPath("pt-br", "guias", slug)
    ? await loadCountryRiskGuidePage(Promise.resolve({ slug }), "pt-br", "guias")
    : await loadGuidePageForFixedLocale(Promise.resolve({ slug }), "pt-br", "guias");
  return <ArticlePage {...page} />;
}
