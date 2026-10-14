import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Inter, Roboto, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({ weight: ["400", "700", "900"], subsets: ["latin"], variable: "--font-roboto" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jet" });

export const metadata: Metadata = {
  title: "PRAIG · Data & AI Privacy, Governance & Protection",
  description: "Mangruve — Private Intelligence Platform. PRAIG workspace.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}