"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger" | "success";
  size?: "sm" | "md";
}

const variants: Record<string, string> = {
  primary:
    "border-jarvis-cyan/60 text-jarvis-cyan hover:bg-jarvis-cyan/10 hover:shadow-glow",
  ghost:
    "border-jarvis-border text-jarvis-dim hover:text-jarvis-cyan hover:border-jarvis-cyan/50",
  danger:
    "border-jarvis-red/60 text-jarvis-red hover:bg-jarvis-red/10 hover:shadow-glow-red",
  success:
    "border-jarvis-green/60 text-jarvis-green hover:bg-jarvis-green/10 hover:shadow-glow-green",
};

export default function GlowButton({
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: GlowButtonProps) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded border font-display uppercase tracking-wider transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        variants[variant],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
