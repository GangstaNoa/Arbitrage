import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, createSessionToken, timingSafeEqual } from "@/lib/session";

export async function POST(req: NextRequest) {
  const configuredPasscode = process.env.APP_PASSCODE;
  if (!configuredPasscode) {
    return NextResponse.json(
      { error: "APP_PASSCODE is not configured on the server." },
      { status: 500 }
    );
  }
  if (!process.env.APP_SESSION_SECRET) {
    return NextResponse.json(
      { error: "APP_SESSION_SECRET is not configured on the server." },
      { status: 500 }
    );
  }

  let body: { passcode?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const submitted = typeof body.passcode === "string" ? body.passcode : "";
  if (!submitted || !timingSafeEqual(submitted, configuredPasscode)) {
    return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
