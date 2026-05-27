import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { adminSections, type AdminSection } from "@/lib/admin/admin-section-config";
import { getAllArticles, getAllEvidencePacks, getAllProducts } from "@/lib/content/repository";
import { BriefsSection, PublishingJobsSection, TopicsSection, TrendsSection } from "./ContentWorkflowSections";
import { MerchantsSection, OfferMatchingSection, OffersSection, PlacementsSection } from "./MonetizationSections";
import { EvidenceSection, ProductsSection } from "./ProductEvidenceSections";
import { ArticlesSection, AuditSection, ComplianceSection, LocalizationSection, QualitySection } from "./ReviewSections";
import { SearchConsoleSection } from "./SearchConsoleSection";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ section: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export function generateStaticParams() {
  return adminSections.map((section) => ({ section }));
}

export default async function AdminSectionPage({ params, searchParams }: PageProps) {
  const { section } = await params;
  const filters = await searchParams;
  if (!adminSections.includes(section as AdminSection)) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-4xl font-semibold">Admin: {section}</h1>
        <div className="mt-6 rounded-md border border-neutral-200 bg-white p-4">
          <AdminTable filters={filters ?? {}} section={section} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

async function AdminTable({ filters, section }: { filters: Record<string, string | string[] | undefined>; section: string }) {
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
