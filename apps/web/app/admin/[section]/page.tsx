import { notFound } from "next/navigation";
import { adminSections, type AdminSection } from "@/lib/admin/admin-section-config";
import { AdminSectionPageShell } from "./AdminSectionPageShell";
import { AdminTable } from "./AdminSectionTable";

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
    <AdminSectionPageShell section={section}>
      <AdminTable filters={filters ?? {}} section={section} />
    </AdminSectionPageShell>
  );
}
