import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/lib/content/repository";
import { datasetRowsForFile, safeFileName, toCsv } from "./datasetCsv";

interface RouteProps {
  params: Promise<{ file: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteProps) {
  const { file } = await params;
  if (!file.endsWith(".csv")) {
    return NextResponse.json({ error: "Dataset file must end with .csv." }, { status: 400 });
  }

  const products = await getAllProducts();
  const csv = toCsv(datasetRowsForFile(products, file));

  return new NextResponse(csv, {
    headers: {
      "Content-Disposition": `attachment; filename="${safeFileName(file)}"`,
      "Content-Type": "text/csv; charset=utf-8"
    }
  });
}
