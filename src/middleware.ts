import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, authGateEnabled, verifySessionToken } from "@/lib/session";

export const config = {
  matcher: ["/((?!_next/static|_next/image|icon.svg|favicon.ico).*)"],
};

export async function middleware(req: NextRequest) {
  if (!authGateEnabled()) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (pathname === "/login" || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const valid = await verifySessionToken(token);
  if (valid) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}
