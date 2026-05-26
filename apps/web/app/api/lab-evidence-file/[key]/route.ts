import { NextRequest, NextResponse } from "next/server";
import { readLabEvidenceFile } from "@/lib/admin/lab-evidence-storage";

interface RouteContext {
  params: Promise<{ key: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { key } = await context.params;
  try {
    const file = await readLabEvidenceFile(key);
    return new NextResponse(file.body, {
      headers: {
        "content-type": file.mimeType,
        "content-disposition": `inline; filename="${file.fileName}"`,
        "cache-control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return NextResponse.json({ error: "Lab evidence file not found." }, { status: 404 });
  }
}

