import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/auth";

const indexStatuses = ["index", "noindex", "pending", "refresh_needed", "merge_candidate"] as const;
const publishStatuses = ["draft", "pending", "published"] as const;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const auth = verifyAdminRequest(request, formData);
  if (!auth.ok) {
    return auth.response;
  }

  const id = stringValue(formData.get("id"));
  const indexStatus = stringValue(formData.get("indexStatus"));
  const publishStatus = stringValue(formData.get("publishStatus"));
  const qualityScoreRaw = stringValue(formData.get("qualityScore"));

  if (!id) {
    return NextResponse.json({ error: "Article id is required." }, { status: 400 });
  }
  if (indexStatus && !indexStatuses.includes(indexStatus as (typeof indexStatuses)[number])) {
    return NextResponse.json({ error: `Invalid indexStatus: ${indexStatus}` }, { status: 400 });
  }
  if (publishStatus && !publishStatuses.includes(publishStatus as (typeof publishStatuses)[number])) {
    return NextResponse.json({ error: `Invalid publishStatus: ${publishStatus}` }, { status: 400 });
  }
  const nextIndexStatus = indexStatus ? (indexStatus as (typeof indexStatuses)[number]) : undefined;
  const nextPublishStatus = publishStatus ? (publishStatus as (typeof publishStatuses)[number]) : undefined;

  const qualityScore = qualityScoreRaw === "" ? undefined : Number(qualityScoreRaw);
  if (qualityScore !== undefined && (!Number.isInteger(qualityScore) || qualityScore < 0 || qualityScore > 100)) {
    return NextResponse.json({ error: "qualityScore must be an integer from 0 to 100." }, { status: 400 });
  }

  try {
    const mutations = await import("@global-import-lab/db/admin-mutations");
    const row = await mutations.updateArticleState({
      id,
      indexStatus: nextIndexStatus,
      publishStatus: nextPublishStatus,
      qualityScore
    });
    await mutations.recordAuditLog({
      entityType: "article",
      entityId: row.id,
      action: "update",
      actor: "admin",
      summary: "Updated article index/publish state."
    });

    const returnTo = stringValue(formData.get("returnTo")) || "/admin/articles/";
    return NextResponse.redirect(new URL(`${returnTo}?updated=${encodeURIComponent(row.id)}`, request.url), 303);
  } catch (error) {
    console.error("Article admin mutation failed.", error);
    return NextResponse.json({ error: "Article update failed. Check database connectivity." }, { status: 503 });
  }
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}
