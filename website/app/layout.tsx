import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import TopBar from "@/components/top-bar";
import MemberStatusBar from "@/components/member-status-bar";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500"],
  style: ["normal", "italic"],
  variable: "--font-editorial",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tijdgeest — De boeken van dit moment",
  description: "Een boek per maand, samen gelezen. Tijdgeest brengt nieuwsgierige lezers bij elkaar in kleine, zorgvuldig samengestelde sessies.",
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`h-full antialiased ${cormorant.variable}`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <TopBar />
        <MemberStatusBar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
