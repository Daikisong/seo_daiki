import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <section className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-700">Global Import Product Intelligence</p>
            <h1 className="mt-3 text-5xl font-semibold leading-tight">Global Import Lab</h1>
            <p className="mt-5 max-w-2xl text-lg text-neutral-700">
              A product evidence database for USB-C chargers, cables, power banks, and import buying risks. Choose a
              language; this page never redirects automatically.
            </p>
            <div className="mt-6">
              <LanguageSwitcher />
            </div>
          </div>
          <div className="rounded-md border border-neutral-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Current cluster</h2>
            <p className="mt-2 text-sm text-neutral-700">
              USB-C charging ecosystem: 65W GaN chargers, 100W chargers, USB-C cables, price truth, variant traps, and
              country risk pages.
            </p>
            <Link
              className="focus-ring mt-4 inline-flex rounded-md bg-neutral-950 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
              href="/en/usb-c-chargers/"
            >
              Open English hub
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
