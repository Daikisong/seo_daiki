import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { prisma } from "./client";
import { createRefreshSuggestion, importSearchConsoleMetrics } from "./searchConsole";
import {
  emptyWorkerImportSummary,
  evidencePackCreateData,
  groupWorkerPacksByProduct,
  marketRiskCreateData,
  priceSnapshotCreateData,
  productImportContext,
  productUpsertData,
  refreshSuggestionInput,
  reviewSignalCreateData,
  searchConsoleMetricInput,
  sellerClaimCreateData,
  uniqueMarketRisks,
  uniquePriceSnapshots,
  uniqueReviewSignals,
  uniqueSellerClaims,
  uniqueVariants,
  uniqueVerifiedClaims,
  variantCreateData,
  verifiedClaimCreateData,
  type WorkerPack
} from "./workerImportRecords";

export async function importWorkerEvidence(root = findProjectRoot()) {
  const packs = loadWorkerEvidencePacks(root);
  const byProduct = groupWorkerPacksByProduct(packs);

  const summary = { ...emptyWorkerImportSummary };
  for (const [productId, productPacks] of byProduct) {
    const context = productImportContext(productId, productPacks);
    const productData = productUpsertData(context);

    await prisma.$transaction(async (tx) => {
      await tx.product.upsert({
        where: { id: productId },
        update: productData,
        create: {
          id: productId,
          ...productData
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

      for (const variant of uniqueVariants(productPacks)) {
        await tx.variant.create({
          data: variantCreateData(productId, context.product, variant)
        });
        summary.variants += 1;
      }

      for (const claim of uniqueSellerClaims(productPacks)) {
        await tx.sellerClaim.create({
          data: sellerClaimCreateData(productId, context.product, claim)
        });
        summary.sellerClaims += 1;
      }

      for (const claim of uniqueVerifiedClaims(productPacks)) {
        await tx.verifiedClaim.create({
          data: verifiedClaimCreateData(productId, claim)
        });
        summary.verifiedClaims += 1;
      }

      for (const signal of uniqueReviewSignals(productPacks)) {
        await tx.reviewSignal.create({
          data: reviewSignalCreateData(productId, signal)
        });
        summary.reviewSignals += 1;
      }

      for (const snapshot of uniquePriceSnapshots(productPacks)) {
        await tx.priceSnapshot.create({
          data: priceSnapshotCreateData(productId, context.product, snapshot)
        });
        summary.priceSnapshots += 1;
      }

      for (const risk of uniqueMarketRisks(productPacks)) {
        await tx.marketRisk.create({
          data: marketRiskCreateData(productId, risk)
        });
        summary.marketRisks += 1;
      }

      for (const pack of productPacks) {
        await tx.evidencePack.create({
          data: evidencePackCreateData(productId, pack)
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
  await importSearchConsoleMetrics(rows.map(searchConsoleMetricInput));
  return { rows: rows.length, source: path };
}

export async function importRefreshSuggestions(file?: string, root = findProjectRoot()) {
  const path = file ? resolve(file) : join(root, "data/exports/search_console_suggestions.json");
  const rows = readJsonFile<Array<Record<string, unknown>>>(path);
  for (const row of rows) {
    await createRefreshSuggestion(refreshSuggestionInput(row));
  }
  return { rows: rows.length, source: path };
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
