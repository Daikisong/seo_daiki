import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin/auth";
import {
  adminPublishGateErrorPayload,
  isAdminPublishGateError
} from "./article-status-errors";
import {
  parseOptionalIndexStatus,
  parseOptionalPublishStatus,
  parseQualityScore,
  stringValue
} from "./article-status-values";

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

  const nextIndexStatus = parseOptionalIndexStatus(indexStatus);
  if (!nextIndexStatus.ok) {
    return NextResponse.json({ error: nextIndexStatus.error }, { status: 400 });
  }

  const nextPublishStatus = parseOptionalPublishStatus(publishStatus);
  if (!nextPublishStatus.ok) {
    return NextResponse.json({ error: nextPublishStatus.error }, { status: 400 });
  }

  const qualityScore = parseQualityScore(qualityScoreRaw);
  if (!qualityScore.ok) {
    return NextResponse.json({ error: qualityScore.error }, { status: 400 });
  }

  try {
    const mutations = await import("@global-import-lab/db/admin-mutations");
    const row = await mutations.updateArticleState({
      id,
      indexStatus: nextIndexStatus.value,
      publishStatus: nextPublishStatus.value,
      qualityScore: qualityScore.value
    });

    const returnTo = stringValue(formData.get("returnTo")) || "/admin/articles/";
    return NextResponse.redirect(new URL(`${returnTo}?updated=${encodeURIComponent(row.id)}`, request.url), 303);
  } catch (error) {
    if (isAdminPublishGateError(error)) {
      return NextResponse.json(adminPublishGateErrorPayload(error), { status: 400 });
    }
    console.error("Article admin mutation failed.", error);
    return NextResponse.json({ error: "Article update failed. Check database connectivity." }, { status: 503 });
  }
}
