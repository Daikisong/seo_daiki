import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { prisma } from "./client";
import { createRefreshSuggestion, importSearchConsoleMetrics } from "./searchConsole";
import type { Prisma } from "./generated/prisma/client";

interface WorkerPack {
  product_id?: string;
  locale?: string;
  product?: Record<string, unknown>;
  variants?: Array<Record<string, unknown>>;
  seller_claims?: Array<Record<string, unknown>>;
  verified_claims?: Array<Record<string, unknown>>;
  review_signals?: Array<Record<string, unknown>>;
  price_snapshots?: Array<Record<string, unknown>>;
  market_risks?: Array<Record<string, unknown>>;
  allowed_claims?: string[];
  forbidden_claims?: string[];
}

interface ImportSummary {
  products: number;
  variants: number;
  sellerClaims: number;
  verifiedClaims: number;
  reviewSignals: number;
  priceSnapshots: number;
  marketRisks: number;
  evidencePacks: number;
}

const emptySummary: ImportSummary = {
  products: 0,
  variants: 0,
  sellerClaims: 0,
  verifiedClaims: 0,
  reviewSignals: 0,
  priceSnapshots: 0,
  marketRisks: 0,
  evidencePacks: 0
};

export async function importWorkerEvidence(root = findProjectRoot()) {
  const packs = loadWorkerEvidencePacks(root);
  const byProduct = new Map<string, WorkerPack[]>();
  for (const pack of packs) {
    const productId = stringValue(pack.product_id);
    if (!productId) {
      continue;
    }
    byProduct.set(productId, [...(byProduct.get(productId) ?? []), pack]);
  }

  const summary = { ...emptySummary };
  for (const [productId, productPacks] of byProduct) {
    const product = productPacks.find((pack) => pack.product)?.product ?? {};
    const title = stringValue(product.title) || productId;
    const slug = slugify(title) || productId;

    await prisma.$transaction(async (tx) => {
      await tx.product.upsert({
        where: { id: productId },
        update: {
          canonicalName: title,
          slug,
          category: stringValue(product.category) || "uncategorized",
          brandClaim: inferBrand(title),
          identityConfidence: 0.7
        },
        create: {
          id: productId,
          canonicalName: title,
          slug,
          category: stringValue(product.category) || "uncategorized",
          brandClaim: inferBrand(title),
          identityConfidence: 0.7
        }
      });
      summary.products += 1;

      await tx.variant.deleteMany({ where: { productId } });
      await tx.sellerClaim.deleteMany({ where: { productId } });
      await tx.verifiedClaim.deleteMany({ where: { productId } });
      await tx.reviewSignal.deleteMany({ where: { productId } });
      await tx.priceSnapshot.deleteMany({ where: { productId } });
      await tx.marketRisk.deleteMany({ where: { productId } });
      await tx.evidencePack.deleteMany({ where: { productId } });

      for (const variant of uniqueRows(productPacks.flatMap((pack) => pack.variants ?? []), variantKey)) {
        const optionName = stringValue(variant.option) || stringValue(variant.optionName) || "Default option";
        await tx.variant.create({
          data: {
            productId,
            sourceSku: stringValue(variant.source_sku) || stringValue(variant.sourceSku) || undefined,
            optionName,
            wattageClaim: numberValue(variant.wattage_claim) ?? parseWattage(optionName),
            plugType: stringValue(variant.plug_type) || parsePlugType(optionName) || undefined,
            cableIncluded: parseCableIncluded(optionName),
            sourceUrl: stringValue(variant.source_url) || stringValue(product.source_url) || "https://example.com/source",
            affiliateUrl: stringValue(variant.affiliate_url) || stringValue(variant.affiliateUrl) || undefined,
            sellerName: stringValue(product.seller) || undefined,
            sellerId: stringValue(variant.seller_id) || stringValue(variant.sellerId) || undefined,
            riskFlags: toJson(variant.risk_flags ?? [])
          }
        });
        summary.variants += 1;
      }

      for (const claim of uniqueRows(productPacks.flatMap((pack) => pack.seller_claims ?? []), claimKey)) {
        await tx.sellerClaim.create({
          data: {
            productId,
            claimType: stringValue(claim.claim_type) || "seller_claim",
            claimValue: stringValue(claim.claim_value) || "unknown",
            rawText: stringValue(claim.raw_text) || undefined,
            sourceUrl: stringValue(claim.source_url) || stringValue(product.source_url) || undefined,
            capturedAt: dateValue(claim.captured_at) ?? dateValue(product.captured_at) ?? new Date(),
            confidence: numberValue(claim.confidence) ?? 0.5
          }
        });
        summary.sellerClaims += 1;
      }

      for (const claim of uniqueRows(productPacks.flatMap((pack) => pack.verified_claims ?? []), claimKey)) {
        await tx.verifiedClaim.create({
          data: {
            productId,
            testType: stringValue(claim.test_type) || stringValue(claim.testType) || "verification",
            resultValue: stringValue(claim.result_value) || stringValue(claim.resultValue) || "unknown",
            unit: stringValue(claim.unit) || undefined,
            method: stringValue(claim.method) || "Worker import",
            evidenceUrl: stringValue(claim.evidence_url) || stringValue(claim.evidenceUrl) || undefined,
            confidence: numberValue(claim.confidence) ?? 0.8,
            testedAt: dateValue(claim.tested_at) ?? dateValue(claim.testedAt) ?? undefined
          }
        });
        summary.verifiedClaims += 1;
      }

      for (const signal of uniqueRows(productPacks.flatMap((pack) => pack.review_signals ?? []), signalKey)) {
        await tx.reviewSignal.create({
          data: {
            productId,
            locale: stringValue(signal.locale) || "en",
            topic: stringValue(signal.topic) || "review signal",
            sentiment: stringValue(signal.sentiment) || "neutral",
            count: numberValue(signal.count) ?? 0,
            confidence: numberValue(signal.confidence) ?? 0.5,
            window: stringValue(signal.window) || undefined
          }
        });
        summary.reviewSignals += 1;
      }

      for (const snapshot of uniqueRows(productPacks.flatMap((pack) => pack.price_snapshots ?? []), priceKey)) {
        await tx.priceSnapshot.create({
          data: {
            productId,
            country: stringValue(snapshot.country) || undefined,
            currency: stringValue(snapshot.currency) || stringValue(product.currency) || "USD",
            price: numberValue(snapshot.price) ?? numberValue(product.price) ?? 0,
            shipping: numberValue(snapshot.shipping) ?? numberValue(product.shipping) ?? undefined,
            coupon: numberValue(snapshot.coupon) ?? undefined,
            finalPrice: numberValue(snapshot.final_price) ?? numberValue(snapshot.finalPrice) ?? undefined,
            capturedAt: dateValue(snapshot.captured_at) ?? dateValue(product.captured_at) ?? new Date()
          }
        });
        summary.priceSnapshots += 1;
      }

      for (const risk of uniqueRows(productPacks.flatMap((pack) => pack.market_risks ?? []), riskKey)) {
        await tx.marketRisk.create({
          data: {
            productId,
            locale: stringValue(risk.locale) || "en",
            country: stringValue(risk.country) || undefined,
            plugRisk: stringValue(risk.plug_risk) || stringValue(risk.plugRisk) || undefined,
            customsRisk: stringValue(risk.customs_risk) || stringValue(risk.customsRisk) || undefined,
            certificationRisk:
              stringValue(risk.certification_risk) || stringValue(risk.certificationRisk) || undefined,
            returnRisk: stringValue(risk.return_risk) || stringValue(risk.returnRisk) || undefined,
            localAlternativeNote:
              stringValue(risk.local_alternative_note) || stringValue(risk.localAlternativeNote) || undefined,
            score: numberValue(risk.score) ?? 0.5
          }
        });
        summary.marketRisks += 1;
      }

      for (const pack of productPacks) {
        await tx.evidencePack.create({
          data: {
            productId,
            locale: stringValue(pack.locale) || "en",
            packJson: toJson(pack)
          }
        });
        summary.evidencePacks += 1;
      }
    });
  }

  return summary;
}

export async function importSearchConsoleSnapshot(file?: string, root = findProjectRoot()) {
  const path = file ? resolve(file) : defaultExistingPath(root, [
    "data/snapshots/search_console_rows.json",
    "data/snapshots/search_console_sample.json"
  ]);
  const rows = readJsonFile<Array<Record<string, unknown>>>(path);
  await importSearchConsoleMetrics(
    rows.map((row) => ({
      page: stringValue(row.page),
      query: stringValue(row.query),
      country: stringValue(row.country) || undefined,
      device: stringValue(row.device) || undefined,
      clicks: numberValue(row.clicks) ?? 0,
      impressions: numberValue(row.impressions) ?? 0,
      ctr: numberValue(row.ctr) ?? 0,
      position: numberValue(row.position) ?? 0,
      startDate: stringValue(row.start_date) || stringValue(row.startDate) || undefined,
      endDate: stringValue(row.end_date) || stringValue(row.endDate) || undefined
    }))
  );
  return { rows: rows.length, source: path };
}

export async function importRefreshSuggestions(file?: string, root = findProjectRoot()) {
  const path = file ? resolve(file) : join(root, "data/exports/search_console_suggestions.json");
  const rows = readJsonFile<Array<Record<string, unknown>>>(path);
  for (const row of rows) {
    await createRefreshSuggestion({
      page: stringValue(row.page),
      query: stringValue(row.query) || undefined,
      reason: stringValue(row.reason) || "Search Console underperformance",
      actions: refreshSuggestionPayload(row)
    });
  }
  return { rows: rows.length, source: path };
}

function refreshSuggestionPayload(row: Record<string, unknown>) {
  return {
    action: Array.isArray(row.action) ? row.action.map((item) => String(item)) : [],
    priority: numberValue(row.priority) ?? undefined,
    country: stringValue(row.country) || undefined,
    device: stringValue(row.device) || undefined,
    diagnostics: isRecord(row.diagnostics) ? row.diagnostics : undefined,
    missing_sections: Array.isArray(row.missing_sections) ? row.missing_sections : [],
    title_candidate: stringValue(row.title_candidate) || undefined,
    meta_description_candidate: stringValue(row.meta_description_candidate) || undefined,
    internal_link_candidates: Array.isArray(row.internal_link_candidates) ? row.internal_link_candidates : []
  };
}

function loadWorkerEvidencePacks(root: string) {
  const evidenceDir = join(root, "data/evidence_packs");
  if (!existsSync(evidenceDir)) {
    return [];
  }
  return readdirSync(evidenceDir)
    .filter((file) => file.endsWith(".json"))
    .flatMap((file) => readJsonFile<WorkerPack[]>(join(evidenceDir, file)));
}

function readJsonFile<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

function defaultExistingPath(root: string, paths: string[]) {
  const found = paths.map((path) => join(root, path)).find((path) => existsSync(path));
  if (!found) {
    throw new Error(`None of these files exist: ${paths.join(", ")}`);
  }
  return found;
}

function findProjectRoot(start = process.cwd()) {
  let current = resolve(start);
  while (current !== dirname(current)) {
    if (existsSync(join(current, "data")) && existsSync(join(current, "pnpm-workspace.yaml"))) {
      return current;
    }
    current = dirname(current);
  }
  return resolve(start, "../..");
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function uniqueRows<T>(rows: T[], keyFn: (row: T) => string) {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = keyFn(row);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function variantKey(row: Record<string, unknown>) {
  return [row.option, row.optionName, row.source_sku, row.sourceSku].map(String).join("|");
}

function claimKey(row: Record<string, unknown>) {
  return [row.claim_type, row.claimType, row.claim_value, row.claimValue, row.raw_text, row.rawText].map(String).join("|");
}

function signalKey(row: Record<string, unknown>) {
  return [row.locale, row.topic, row.sentiment, row.window].map(String).join("|");
}

function priceKey(row: Record<string, unknown>) {
  return [row.country, row.currency, row.price, row.shipping, row.final_price, row.finalPrice].map(String).join("|");
}

function riskKey(row: Record<string, unknown>) {
  return [row.locale, row.country].map(String).join("|");
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : value === undefined || value === null ? "" : String(value);
}

function numberValue(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function dateValue(value: unknown) {
  const raw = stringValue(value);
  if (!raw) {
    return undefined;
  }
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function inferBrand(title: string) {
  return title.split(/\s+/)[0] || undefined;
}

function parseWattage(value: string) {
  const match = value.match(/(\d+)\s*w/i);
  return match ? Number(match[1]) : undefined;
}

function parsePlugType(value: string) {
  const match = value.match(/\b(US|EU|UK|AU)\b/i);
  return match ? match[1].toUpperCase() : undefined;
}

function parseCableIncluded(value: string) {
  if (/no cable|without cable/i.test(value)) {
    return false;
  }
  if (/with cable|cable included/i.test(value)) {
    return true;
  }
  return undefined;
}
