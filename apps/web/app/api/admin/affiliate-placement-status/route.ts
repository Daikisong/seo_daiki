import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/auth";

const statuses = ["draft", "approved", "rejected", "disabled"] as const;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const auth = verifyAdminRequest(request, formData);
  if (!auth.ok) {
    return auth.response;
  }

  const id = stringValue(formData.get("id"));
  const status = stringValue(formData.get("status"));
  const returnTo = stringValue(formData.get("returnTo")) || "/admin/placements/";
  const disclosureRaw = stringValue(formData.get("disclosureShown"));
  const disclosureShown = disclosureRaw ? disclosureRaw === "true" : undefined;

  if (!id) {
    return NextResponse.json({ error: "Affiliate placement id is required." }, { status: 400 });
  }
  if (!statuses.includes(status as (typeof statuses)[number])) {
    return NextResponse.json({ error: `Invalid affiliate placement status: ${status}` }, { status: 400 });
  }

  try {
    const affiliate = await import("@global-import-lab/db/affiliate-clicks");
    const row = await affiliate.updateAffiliatePlacementStatus({
      id,
      status: status as (typeof statuses)[number],
      disclosureShown: status === "approved" ? disclosureShown : undefined,
      actor: "admin"
    });
    return NextResponse.redirect(
      new URL(`${returnTo}?placement=${encodeURIComponent(row.id)}&status=${encodeURIComponent(row.status)}`, request.url),
      303
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Affiliate placement status update failed.";
    const statusCode = error && typeof error === "object" && "status" in error && typeof error.status === "number" ? error.status : 503;
    console.error("Affiliate placement status update failed.", error);
    return NextResponse.json(
      { error: statusCode === 503 ? "Affiliate placement update failed. Check database connectivity." : message },
      { status: statusCode }
    );
  }
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}
