import { HTMLAttributes, ReactNode } from "react";

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: boolean;
  corners?: boolean;
}

export default function GlassPanel({
  children,
  className,
  glow = false,
  corners = true,
  ...rest
}: GlassPanelProps) {
  return (
    <div
      className={cx(
        "rounded-lg border border-jarvis-border/70 bg-jarvis-panel/60 backdrop-blur-md shadow-panel",
        glow && "shadow-glow",
        corners && "hud-corner",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
