"use client";

import GlowButton from "./GlowButton";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function PrintButton({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  const { t } = useLanguage();
  return (
    <GlowButton
      variant="ghost"
      size="sm"
      className={className}
      onClick={() => window.print()}
    >
      🖨 {label ?? t("print.print")}
    </GlowButton>
  );
}
