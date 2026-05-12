import type { Metadata } from "next";
import TopBar from "@/components/top-bar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tijdgeest — De boeken van dit moment",
  description: "Een boek per maand, samen gelezen. Tijdgeest brengt nieuwsgierige lezers bij elkaar in kleine, zorgvuldig samengestelde sessies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <TopBar />
        {children}
      </body>
    </html>
  );
}
