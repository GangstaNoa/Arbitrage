import { NextRequest, NextResponse } from "next/server";
import { STORAGE_PREFIX } from "@/lib/storage";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// Every localStorage key the app writes is namespaced with STORAGE_PREFIX.
// Only those keys may be read/written remotely — nothing else is reachable
// through this route, regardless of what a client sends.
function isAllowedKey(key: string): boolean {
  return key.startsWith(STORAGE_PREFIX) && key.length < 200;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { key: string } }
) {
  const key = decodeURIComponent(params.key);
  if (!isAllowedKey(key)) {
    return NextResponse.json({ error: "Unknown key." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ enabled: false, value: null, updatedAt: null });
  }

  const { data, error } = await supabase
    .from("app_state")
    .select("value, updated_at")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    enabled: true,
    value: data?.value ?? null,
    updatedAt: data?.updated_at ?? null,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  const key = decodeURIComponent(params.key);
  if (!isAllowedKey(key)) {
    return NextResponse.json({ error: "Unknown key." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ enabled: false, updatedAt: null });
  }

  let body: { value?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!("value" in body)) {
    return NextResponse.json({ error: "Missing value." }, { status: 400 });
  }

  const updatedAt = new Date().toISOString();
  const { error } = await supabase
    .from("app_state")
    .upsert({ key, value: body.value, updated_at: updatedAt }, { onConflict: "key" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ enabled: true, updatedAt });
}
