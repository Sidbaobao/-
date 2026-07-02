import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-fraunces",
  display: "swap"
});

const siteDescription =
  "A decision-support tool that helps Chinese international students think through whether to stay in the US or return to China.";

export const metadata: Metadata = {
  title: {
    default: "Stay or Return",
    template: "%s · Stay or Return"
  },
  description: siteDescription,
  openGraph: {
    title: "Stay or Return",
    description: siteDescription,
    type: "website",
    siteName: "Stay or Return"
  },
  twitter: {
    card: "summary",
    title: "Stay or Return",
    description: siteDescription
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
