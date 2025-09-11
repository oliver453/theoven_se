import type { Viewport } from "next";
import "../globals.css";
import { LanguageProvider } from "../../../contexts/LanguageContext";
import { rusticPrinted, robotoSlab } from "../fonts";

// Viewport konfiguration för Next.js 15
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>{children}</LanguageProvider>
  );
}