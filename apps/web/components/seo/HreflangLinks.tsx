import type { HreflangMap } from "@global-import-lab/types";

interface HreflangLinksProps {
  alternates: HreflangMap;
}

export function HreflangLinks({ alternates }: HreflangLinksProps) {
  return (
    <>
      {Object.entries(alternates).map(([hreflang, href]) =>
        href ? <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} /> : null
      )}
    </>
  );
}
