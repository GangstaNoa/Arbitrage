"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <main className="flex min-h-screen items-center justify-center px-4">{children}</main>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <TopBar />
        <main className="flex-1 px-3 pb-16 pt-4 sm:px-5 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
