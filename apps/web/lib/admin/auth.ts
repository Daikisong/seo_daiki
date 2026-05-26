import { NextRequest, NextResponse } from "next/server";

export function verifyAdminRequest(request: NextRequest, formData?: FormData) {
  const configuredToken = process.env.ADMIN_TOKEN;
  if (!configuredToken) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "ADMIN_TOKEN is not configured, so admin mutations are disabled." },
        { status: 403 }
      )
    };
  }

  const suppliedToken =
    request.headers.get("x-admin-token") ??
    stringValue(formData?.get("adminToken")) ??
    "";

  if (suppliedToken !== configuredToken) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Invalid admin token." }, { status: 401 })
    };
  }

  return { ok: true as const };
}

function stringValue(value: FormDataEntryValue | null | undefined) {
  return typeof value === "string" ? value : "";
}

