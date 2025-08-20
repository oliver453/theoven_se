import type { Metadata } from "next";

const siteConfig = {
  name: "Diavana",
  description: "Vi tror på enkel och effektiv ärendehantering. Därför utvecklar vi Diavana – framtidens diarieföringssystem för offentlig sektor.",
  url: "https://diavana.se",
  ogImage: "/og.png",
  creator: "@diavana",
  keywords: [
    "Diavana",
    "kommer snart",
    "kommuner",
    "teknik",
    "startup",
    "Sverige"
  ],
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Kommer snart | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.name,
    },
  ],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: siteConfig.url,
    title: `Kommer snart | ${siteConfig.name}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1920,
        height: 1080,
        alt: `${siteConfig.name} | Kommer snart`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Kommer snart | ${siteConfig.name}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.creator,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "OW54Iy101WIhLFjiEv1XeJOwmpxj4vRY3rpHZLnIqts",
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "technology",
};

export { siteConfig };