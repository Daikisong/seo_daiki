import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { trendSiteName } from "@/lib/trend-site/categories";
import { requestAbsoluteUrl } from "@/lib/trend-site/request-url";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `How ${trendSiteName} Builds Briefs`,
    description: `How ${trendSiteName} uses specs, review patterns, prices, seller terms, and return checks in fast-moving briefs.`,
    alternates: {
      canonical: await requestAbsoluteUrl("/methodology/"),
    },
  };
}

const evidenceLevels = [
  {
    title: "Original usage notes",
    body: "When Jacob has original usage notes for the exact product variant, the Brief can include the usage window, setup context, and practical observations.",
  },
  {
    title: "Review-pattern picks",
    body: "The product is judged from public specs, merchant listings, current prices, seller terms, and repeated patterns in buyer reviews or credible third-party coverage.",
  },
  {
    title: "Specs-first comparisons",
    body: "The product has enough public spec and listing information to compare, but the recommendation stays conservative until stronger buyer feedback is available.",
  },
  {
    title: "Hold for clearer proof",
    body: "The product should usually stay out of recommendation lists until the exact variant, price, seller details, and buyer feedback are clearer.",
  },
] as const;

export default function MethodologyPage() {
  return (
    <>
      <SiteHeader currentHref="/methodology/" />
      <main className="mx-auto max-w-3xl px-4 py-10 text-neutral-900">
        <h1 className="text-[21px] font-bold leading-[23.1px] tracking-normal text-[#2b2f33] md:text-[25.6px] md:leading-[28.16px] xl:text-[32px] xl:leading-[35.2px]">
          How {trendSiteName} Builds Briefs
        </h1>
        <div className="mt-[25px] space-y-[25px] text-[15px] leading-[21px] text-neutral-800 md:text-base md:leading-6">
          <p>
            {trendSiteName} briefs start from checkable buying evidence: public
            specs, exact variants, current prices, seller terms, warranty terms,
            return paths, credible third-party coverage, and repeated review
            complaints.
          </p>
          <p>
            A product is useful only when the reader can understand who it fits,
            who should skip it, and what can go wrong after checkout. Affiliate
            availability does not make a product stronger.
          </p>
          <p>
            Issue-led articles also need region fit. If the topic is Europe, the
            product guidance should address local voltage, plug type, model
            suffixes, retailer listing, delivery timing, window or installation
            fit, and whether the return path works for a bulky item.
          </p>
        </div>

        <section className="mt-10">
          <h2 className="border-b-4 border-cyan-500 pb-3 text-[28px] font-bold leading-[31px] tracking-normal text-[#2b2f33] md:text-[32px] md:leading-[35.2px]">
            How each pick is supported
          </h2>
          <div className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
            {evidenceLevels.map((level) => (
              <article className="py-5" key={level.title}>
                <h3 className="text-base font-black text-neutral-950">
                  {level.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-700">
                  {level.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="border-b-4 border-cyan-500 pb-3 text-[28px] font-bold leading-[31px] tracking-normal text-[#2b2f33] md:text-[32px] md:leading-[35.2px]">
            Product Card Standard
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-neutral-700">
            <li>
              <strong className="text-neutral-950">Why recommend:</strong> the
              practical reason the product belongs in the shortlist.
            </li>
            <li>
              <strong className="text-neutral-950">Best for:</strong> the buyer
              profile or use case where it makes sense.
            </li>
            <li>
              <strong className="text-neutral-950">Skip if:</strong> the
              condition where the recommendation breaks.
            </li>
            <li>
              <strong className="text-neutral-950">Repeated complaints:</strong>{" "}
              the low-star or buyer-friction patterns readers should check
              before buying.
            </li>
            <li>
              <strong className="text-neutral-950">Checked sources:</strong> the
              product page or spec source, the review source, and where the
              price was checked for the current guide.
            </li>
            <li>
              <strong className="text-neutral-950">Region fit:</strong> the
              country, voltage, plug, warranty, return, and model-suffix issue
              that could make an otherwise good product a bad local purchase.
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="border-b-4 border-cyan-500 pb-3 text-[28px] font-bold leading-[31px] tracking-normal text-[#2b2f33] md:text-[32px] md:leading-[35.2px]">
            Corrections and Updates
          </h2>
          <div className="mt-5 space-y-3 text-sm leading-6 text-neutral-700">
            <p>
              If a brief misclassifies a product, uses an outdated model page,
              or misses a repeated buyer complaint, it should be corrected
              rather than hidden behind a generic affiliate disclaimer.
            </p>
            <p>
              Price and stock move quickly, so product pages should show when
              the price was checked and should be refreshed when the model,
              marketplace page, or return path changes materially.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
