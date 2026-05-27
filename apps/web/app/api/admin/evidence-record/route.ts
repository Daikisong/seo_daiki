import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/auth";
import { applyEvidenceRecordMutation } from "@/lib/admin/evidence-record-route-actions";
import { stringValue } from "@/lib/admin/evidence-record-form-values";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const auth = verifyAdminRequest(request, formData);
  if (!auth.ok) {
    return auth.response;
  }

  const recordType = stringValue(formData.get("recordType"));
  const returnTo = stringValue(formData.get("returnTo")) || "/admin/evidence/";

  try {
    const mutations = await import("@global-import-lab/db/admin-mutations");
    const { action, updatedId } = await applyEvidenceRecordMutation(recordType, formData, mutations);

    if (mutations.isAdminEntityType(recordType)) {
      await mutations.recordAuditLog({
        entityType: recordType,
        entityId: updatedId,
        action,
        actor: "admin",
        summary: `${action} ${recordType}.`
      });
    }

    return NextResponse.redirect(new URL(`${returnTo}?updated=${encodeURIComponent(updatedId)}`, request.url), 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Admin evidence mutation failed.";
    const status = isBadRequestMessage(message) ? 400 : 503;
    console.error("Admin evidence mutation failed.", error);
    return NextResponse.json(
      { error: status === 400 ? message : "Evidence record update failed. Check database connectivity." },
      { status }
    );
  }
}

function isBadRequestMessage(message: string) {
  return (
    message.includes("required")
    || message.includes("JSON")
    || message.includes("must be")
    || message.includes("Invalid locale")
    || message.includes("Unsupported recordType")
  );
}
