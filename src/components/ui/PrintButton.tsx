"use client";

import GlowButton from "./GlowButton";

export default function PrintButton({
  label = "Print",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <GlowButton
      variant="ghost"
      size="sm"
      className={className}
      onClick={() => window.print()}
    >
      🖨 {label}
    </GlowButton>
  );
}
