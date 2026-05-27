import { getAllArticles, getAllEvidencePacks, getAllProducts } from "@/lib/content/repository";
import { BriefsSection, PublishingJobsSection, TopicsSection, TrendsSection } from "./ContentWorkflowSections";
import { MerchantsSection, OfferMatchingSection, OffersSection, PlacementsSection } from "./MonetizationSections";
import { EvidenceSection, ProductsSection } from "./ProductEvidenceSections";
import { ArticlesSection, AuditSection, ComplianceSection, LocalizationSection, QualitySection } from "./ReviewSections";
import { SearchConsoleSection } from "./SearchConsoleSection";

export async function AdminTable({
  filters,
  section
}: {
  filters: Record<string, string | string[] | undefined>;
  section: string;
}) {
  const [articles, evidencePacks, products] = await Promise.all([
    getAllArticles(),
    getAllEvidencePacks(),
    getAllProducts()
  ]);

  if (section === "products") {
    return <ProductsSection products={products} />;
  }

  if (section === "evidence") {
    return <EvidenceSection evidencePacks={evidencePacks} products={products} />;
  }

  if (section === "quality") {
    return <QualitySection articles={articles} evidencePacks={evidencePacks} products={products} />;
  }

  if (section === "search-console") {
    return <SearchConsoleSection />;
  }

  if (section === "audit") {
    return <AuditSection />;
  }

  if (section === "trends") {
    return <TrendsSection filters={filters} />;
  }

  if (section === "topics") {
    return <TopicsSection />;
  }

  if (section === "briefs") {
    return <BriefsSection />;
  }

  if (section === "publishing-jobs") {
    return <PublishingJobsSection />;
  }

  if (section === "compliance") {
    return <ComplianceSection articles={articles} evidencePacks={evidencePacks} products={products} />;
  }

  if (section === "localization") {
    return <LocalizationSection />;
  }

  if (section === "merchants") {
    return <MerchantsSection />;
  }

  if (section === "offers") {
    return <OffersSection />;
  }

  if (section === "offer-matching") {
    return <OfferMatchingSection />;
  }

  if (section === "placements") {
    return <PlacementsSection />;
  }

  return <ArticlesSection articles={articles} />;
}
