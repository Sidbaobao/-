"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TopNav } from "@/components/layout/top-nav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen">
      <TopNav />
      <main
        className={
          isHome
            ? "flex min-h-screen w-full flex-col"
            : "mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8"
        }
      >
        {children}
      </main>
    </div>
  );
}
