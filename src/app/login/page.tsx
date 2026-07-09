"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GlassPanel from "@/components/ui/GlassPanel";
import GlowButton from "@/components/ui/GlowButton";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Incorrect passcode.");
        setSubmitting(false);
        return;
      }
      const next = searchParams.get("next") || "/";
      router.replace(next);
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection.");
      setSubmitting(false);
    }
  };

  return (
    <GlassPanel glow className="w-full max-w-sm p-6">
      <div className="mb-5 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-jarvis-cyan/60 shadow-glow">
          <span className="font-display text-xl font-bold text-jarvis-cyan text-glow">
            J
          </span>
        </div>
        <div className="font-display text-lg font-bold tracking-widest text-jarvis-cyan text-glow">
          JARVIS X5
        </div>
        <div className="text-[11px] uppercase tracking-widest text-jarvis-dim">
          Garage OS — Access Locked
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          inputMode="text"
          autoFocus
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Enter passcode"
          className="w-full rounded border border-jarvis-border/70 bg-jarvis-panel/60 px-3 py-2 text-sm text-jarvis-cyan placeholder:text-jarvis-dim focus:border-jarvis-cyan/60 focus:outline-none"
        />
        {error && <p className="text-xs text-jarvis-red">{error}</p>}
        <GlowButton
          type="submit"
          disabled={submitting || !passcode}
          className="w-full"
        >
          {submitting ? "Verifying…" : "Unlock"}
        </GlowButton>
      </form>
    </GlassPanel>
  );
}
