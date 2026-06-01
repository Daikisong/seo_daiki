import { NextResponse, type NextRequest } from "next/server";

const languagePathPattern = /^\/[a-z]{2}\/([a-z]{2}(?:-[a-z]{2})?)(?:\/|$)/i;

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  const language = request.nextUrl.pathname.match(languagePathPattern)?.[1]?.toLowerCase();
  if (language) {
    headers.set("x-market-language", language);
  }
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"]
};
