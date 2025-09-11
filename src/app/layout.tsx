import type { Viewport, Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "../../contexts/LanguageContext";
import { rusticPrinted, robotoSlab } from "./fonts";
import { defaultMetadata } from "./metadata";

// Viewport config
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

// Metadata från metadata.ts
export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="sv"
      className={`${rusticPrinted.variable} ${robotoSlab.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${robotoSlab.className} bg-black text-white antialiased selection:bg-primary/20`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}