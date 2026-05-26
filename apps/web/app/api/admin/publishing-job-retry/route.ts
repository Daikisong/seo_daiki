import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const auth = verifyAdminRequest(request, formData);
  if (!auth.ok) {
    return auth.response;
  }

  const id = stringValue(formData.get("id"));
  if (!id) {
    return NextResponse.json({ error: "Publishing job id is required." }, { status: 400 });
  }

  try {
    const operations = await import("@global-import-lab/db/operations-admin");
    const row = await operations.retryPublishingJob({ id, actor: "admin" });
    const returnTo = stringValue(formData.get("returnTo")) || "/admin/publishing-jobs/";
    return NextResponse.redirect(new URL(`${returnTo}?job=${encodeURIComponent(row.id)}&status=${encodeURIComponent(row.status)}`, request.url), 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Publishing job retry failed.";
    console.error("Publishing job retry failed.", error);
    return NextResponse.json({ error: message.includes("was not found") ? message : "Publishing job retry failed. Check database connectivity." }, { status: message.includes("was not found") ? 404 : 503 });
  }
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}
