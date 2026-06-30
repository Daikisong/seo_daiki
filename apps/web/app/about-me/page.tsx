import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { requestAbsoluteUrl } from "@/lib/trend-site/request-url";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About Jacob | TREND - Jacob",
    description: "About Jacob and the evidence-based buying guide model behind TREND - Jacob.",
    alternates: {
      canonical: await requestAbsoluteUrl("/about-me/")
    }
  };
}

export default function AboutMePage() {
  return (
    <>
      <SiteHeader currentHref="/about-me/" />
      <main className="mx-auto max-w-3xl px-4 py-10 text-neutral-900">
        <h1 className="text-[21px] font-bold leading-[23.1px] tracking-normal text-[#2b2f33] md:text-[25.6px] md:leading-[28.16px] xl:text-[32px] xl:leading-[35.2px]">About Jacob</h1>
        <div className="mt-[25px] space-y-[25px] text-[15px] leading-[21px] text-neutral-800 md:text-base md:leading-6">
          <p>
            Hi, I&apos;m Jacob. I run TREND - Jacob as a small buyer-decision site for fast-moving product trends across
            AliExpress, Temu, Amazon, iHerb, and other marketplaces.
          </p>
          <p>
            Most guides start with verifiable buyer evidence: public specs, merchant listings, price snapshots,
            warranty or return terms, seller signals, credible third-party coverage, and repeated review complaints.
          </p>
          <p>
            Each product should answer four practical questions: why it is worth considering, who it fits, who should
            skip it, and what complaints or risks readers should check before checkout.
          </p>
          <p>
            My default standard is simple: every guide should show the exact variant, the spec source, the review
            signal, the marketplace route, the price-check date, and the return or warranty issue that can change the
            recommendation.
          </p>
          <p>
            Region fit matters. A product that makes sense in the United States can be a bad Europe recommendation if
            the voltage, plug, window kit, warranty territory, local stock, or bulky-return route does not match the
            reader&apos;s country.
          </p>
          <p>
            Corrections matter too. If a model number, price route, availability note, or product classification looks
            wrong, send the exact page and correction details through the contact page so the guide can be updated.
          </p>
          <p>
            Product links may be paid affiliate links. That does not make a weak product stronger; it only gives the
            reader a route to check the current price when the buying case already makes sense.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
