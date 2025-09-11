import { Roboto_Slab } from "next/font/google";
import localFont from "next/font/local";

// Google Font
export const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  weight: ["400", "700"],
  display: "swap",
});

export const rusticPrinted = localFont({
  src: "./rustic-printed.woff2",
  variable: "--font-rustic",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
});
