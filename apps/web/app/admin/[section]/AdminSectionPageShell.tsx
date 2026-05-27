import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function AdminSectionPageShell({ children, section }: { children: ReactNode; section: string }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-4xl font-semibold">Admin: {section}</h1>
        <div className="mt-6 rounded-md border border-neutral-200 bg-white p-4">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
