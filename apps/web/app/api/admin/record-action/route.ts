import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const auth = verifyAdminRequest(request, formData);
  if (!auth.ok) {
    return auth.response;
  }

  const entityType = stringValue(formData.get("entityType"));
  const entityId = stringValue(formData.get("entityId"));
  const action = stringValue(formData.get("action"));
  const returnTo = stringValue(formData.get("returnTo")) || "/admin/";

  if (!entityId) {
    return NextResponse.json({ error: "entityId is required." }, { status: 400 });
  }

  try {
    const mutations = await import("@global-import-lab/db/admin-mutations");
    if (!mutations.isAdminEntityType(entityType)) {
      return NextResponse.json({ error: `Invalid entityType: ${entityType}` }, { status: 400 });
    }
    if (!mutations.isAdminRecordAction(action)) {
      return NextResponse.json({ error: `Invalid action: ${action}` }, { status: 400 });
    }

    if (action === "archive") {
      await mutations.archiveAdminRecord({ entityType, entityId, actor: "admin" });
    } else {
      await mutations.deleteAdminRecord({ entityType, entityId, actor: "admin" });
    }

    return NextResponse.redirect(new URL(`${returnTo}?${action}d=${encodeURIComponent(entityId)}`, request.url), 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin record action failed.";
    const status = message.includes("was not found") ? 404 : 503;
    console.error("Admin record action failed.", error);
    return NextResponse.json(
      { error: status === 404 ? message : "Record action failed. Check database connectivity." },
      { status }
    );
  }
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}
