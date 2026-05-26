import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/lib/content/repository";

interface RouteProps {
  params: Promise<{ file: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteProps) {
  const { file } = await params;
  if (!file.endsWith(".csv")) {
    return NextResponse.json({ error: "Dataset file must end with .csv." }, { status: 400 });
  }

  const products = await getAllProducts();
  const category = categoryFromDatasetFile(file);
  const rows = category ? products.filter((product) => product.category === category) : products;
  const csv = toCsv([
    [
      "product_id",
      "product_name",
      "category",
      "seller_claim_count",
      "verified_claim_count",
      "variant_count",
      "latest_currency",
      "latest_price",
      "latest_final_price",
      "latest_checked"
    ],
    ...rows.map((product) => {
      const latestPrice = product.priceSnapshots.at(-1);
      return [
        product.id,
        product.canonicalName,
        product.category,
        String(product.sellerClaims.length),
        String(product.verifiedClaims.length),
        String(product.variants.length),
        latestPrice?.currency ?? "",
        latestPrice ? String(latestPrice.price) : "",
        latestPrice?.finalPrice === undefined ? "" : String(latestPrice.finalPrice),
        latestPrice?.capturedAt ?? ""
      ];
    })
  ]);

  return new NextResponse(csv, {
    headers: {
      "Content-Disposition": `attachment; filename="${safeFileName(file)}"`,
      "Content-Type": "text/csv; charset=utf-8"
    }
  });
}

function categoryFromDatasetFile(file: string) {
  if (file.includes("power-bank")) {
    return "power-banks";
  }
  if (file.includes("cable")) {
    return "usb-c-cables";
  }
  if (file.includes("charger") || file.includes("gan")) {
    return "usb-c-chargers";
  }
  return undefined;
}

function toCsv(rows: string[][]) {
  return rows.map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

function csvCell(value: string) {
  if (!/[",\n\r]/.test(value)) {
    return value;
  }
  return `"${value.replace(/"/g, '""')}"`;
}

function safeFileName(file: string) {
  return file.replace(/[^a-z0-9._-]/gi, "-");
}
