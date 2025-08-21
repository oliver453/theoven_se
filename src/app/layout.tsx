import cx from "classnames";
import "./globals.css";
import type { Metadata } from "next";
import { defaultMetadata } from "@/lib/metadata";
import { Copernicus, Styrne } from './fonts';
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import Navbar from "@/components/layout/navbar";
import CookieBanner from "@/components/home/cookie-banner";

export const metadata: Metadata = defaultMetadata;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv-SE">
      <body className={cx(Styrne.variable, Copernicus.variable)}>
        <div className="fixed h-screen w-full bg-gradient-to-b from-transparent to-background/60" />
        <Suspense fallback="...">
          <Navbar />
        </Suspense>
        <main className="flex min-h-screen w-full flex-col items-center justify-center pt-28 md:pt-32">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}