"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ResetProgressButton } from "@/components/ui/reset-progress-button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/questionnaire", label: "Questionnaire" },
  { href: "/weights", label: "Weights" },
  { href: "/results", label: "Results" },
  { href: "/report", label: "Report" }
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-white/60 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-ink">
          Stay or Return
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? "font-medium text-slateBlue" : "text-sm text-ink/70 hover:text-ink"}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <ResetProgressButton />
      </div>
    </header>
  );
}
