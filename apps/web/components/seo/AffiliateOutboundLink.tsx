"use client";

import { ExternalLink } from "lucide-react";

interface AffiliateOutboundLinkProps {
  articleId: string;
  compact?: boolean;
  href: string;
  label: string;
  locale: string;
  productId?: string;
  rel: string;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function AffiliateOutboundLink({
  articleId,
  compact = false,
  href,
  label,
  locale,
  productId,
  rel,
}: AffiliateOutboundLinkProps) {
  const sizeClass = compact
    ? "gap-1 whitespace-normal px-3 py-2 text-center text-xs leading-4"
    : "gap-2 whitespace-nowrap px-4 py-2 text-sm";

  return (
    <a
      className={`focus-ring inline-flex items-center justify-center rounded-md bg-teal-700 font-semibold text-white hover:bg-teal-800 ${sizeClass}`}
      href={href}
      onClick={() => {
        window.gtag?.("event", "affiliate_click", {
          affiliate_label: label,
          article_id: articleId,
          link_url: outboundTargetFromHref(href),
          locale,
          product_id: productId,
          transport_type: "beacon",
        });
      }}
      rel={`${rel} noopener noreferrer`}
      target="_blank"
    >
      {label}
      <ExternalLink aria-hidden size={compact ? 13 : 16} />
    </a>
  );
}

function outboundTargetFromHref(href: string) {
  try {
    const url = new URL(href, window.location.origin);
    return (
      url.searchParams.get("placementId") ??
      url.searchParams.get("target") ??
      href
    );
  } catch {
    return href;
  }
}
