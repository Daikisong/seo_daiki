import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/auth";

const refreshSuggestionStatuses = ["open", "planned", "applied", "dismissed"] as const;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const auth = verifyAdminRequest(request, formData);
  if (!auth.ok) {
    return auth.response;
  }

  const id = stringValue(formData.get("id"));
  const status = stringValue(formData.get("status"));
  const returnTo = stringValue(formData.get("returnTo")) || "/admin/search-console/";

  if (!id) {
    return NextResponse.json({ error: "Suggestion id is required." }, { status: 400 });
  }
  if (!refreshSuggestionStatuses.includes(status as (typeof refreshSuggestionStatuses)[number])) {
    return NextResponse.json({ error: `Invalid refresh suggestion status: ${status}` }, { status: 400 });
  }

  try {
    const searchConsole = await import("@global-import-lab/db/search-console");
    const row = await searchConsole.updateRefreshSuggestionStatus({
      id,
      status: status as (typeof refreshSuggestionStatuses)[number],
      actor: "admin"
    });
    return NextResponse.redirect(
      new URL(`${returnTo}?refreshSuggestion=${encodeURIComponent(row.id)}&status=${encodeURIComponent(row.status)}`, request.url),
      303
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Refresh suggestion update failed.";
    const statusCode = message.includes("was not found") ? 404 : 503;
    console.error("Refresh suggestion status update failed.", error);
    return NextResponse.json(
      { error: statusCode === 404 ? message : "Refresh suggestion update failed. Check database connectivity." },
      { status: statusCode }
    );
  }
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}
