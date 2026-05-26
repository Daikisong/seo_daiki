import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/auth";

const statuses = ["draft", "approved", "rejected", "converted"] as const;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const auth = verifyAdminRequest(request, formData);
  if (!auth.ok) {
    return auth.response;
  }

  const id = stringValue(formData.get("id"));
  const status = stringValue(formData.get("status"));
  if (!id) {
    return NextResponse.json({ error: "Content brief id is required." }, { status: 400 });
  }
  if (!statuses.includes(status as (typeof statuses)[number])) {
    return NextResponse.json({ error: `Invalid content brief status: ${status}` }, { status: 400 });
  }

  try {
    const operations = await import("@global-import-lab/db/operations-admin");
    const row = await operations.updateContentBriefStatus({ id, status: status as (typeof statuses)[number], actor: "admin" });
    const returnTo = stringValue(formData.get("returnTo")) || "/admin/briefs/";
    return NextResponse.redirect(new URL(`${returnTo}?brief=${encodeURIComponent(row.id)}&status=${encodeURIComponent(row.status)}`, request.url), 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Content brief status update failed.";
    console.error("Content brief status update failed.", error);
    return NextResponse.json({ error: message.includes("was not found") ? message : "Content brief update failed. Check database connectivity." }, { status: message.includes("was not found") ? 404 : 503 });
  }
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}
