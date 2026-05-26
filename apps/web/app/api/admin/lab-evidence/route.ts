import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/auth";
import { storeLabEvidenceFile } from "@/lib/admin/lab-evidence-storage";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const auth = verifyAdminRequest(request, formData);
  if (!auth.ok) {
    return auth.response;
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A lab evidence file is required." }, { status: 400 });
  }

  const measurementType = stringValue(formData.get("measurementType")) || "measurement";
  const productId = stringValue(formData.get("productId")) || undefined;
  const verifiedClaimId = stringValue(formData.get("verifiedClaimId")) || undefined;
  const notes = stringValue(formData.get("notes")) || undefined;

  try {
    const stored = await storeLabEvidenceFile(file);
    if (process.env.CONTENT_SOURCE === "database") {
      const { createLabEvidenceAsset } = await import("@global-import-lab/db/lab-evidence");
      await createLabEvidenceAsset({
        productId,
        verifiedClaimId,
        measurementType,
        fileName: stored.fileName,
        storageKey: stored.storageKey,
        publicUrl: stored.publicUrl,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
        checksumSha256: stored.checksumSha256,
        notes
      });
    }

    const returnTo = stringValue(formData.get("returnTo")) || "/admin/evidence/";
    return NextResponse.redirect(new URL(`${returnTo}?uploaded=${encodeURIComponent(stored.storageKey)}`, request.url), 303);
  } catch (error) {
    console.error("Lab evidence upload failed.", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 503 });
  }
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

