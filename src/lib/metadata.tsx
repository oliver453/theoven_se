import type { Metadata } from "next";

const siteConfig = {
  name: "Diavana",
  description: "Här hittar du hjälp, guider och support för Diavana. Vi finns här för att göra din ärendehantering enkel, säker och effektiv – varje dag.",
  url: "https://support.diavana.se",
  ogImage: "/og.png",
  creator: "@diavana",
  keywords: [
    "Diavana",
    "hjälpcenter",
    "kommuner",
    "teknik",
    "startup",
    "Sverige"
  ],
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Hjälpcenter | ${siteConfig.name}`,
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
    title: `Hjälpcenter | ${siteConfig.name}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1920,
        height: 1080,
        alt: `${siteConfig.name} | Hjälpcenter`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Hjälpcenter | ${siteConfig.name}`,
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
  alternates: {
    canonical: siteConfig.url,
  },
  category: "technology",
};

export { siteConfig };