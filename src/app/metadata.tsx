import type { Metadata } from "next";

export const siteConfig = {
  name: "The Oven | Äkta napolitansk pizza i Arvika",
  shortName: "The Oven",
  description:
    "Vi serverar äkta napolitansk pizza bakad i vedugn, lunchbuffé och à la carte. Med noggrant utvalda råvaror och genuin service får du en matupplevelse utöver det vanliga. Välkommen till oss på Kyrkogatan 20 i Arvika.",
  url: "https://theoven.se",
  ogImage: "/og.png",
  creator: "@theovenarvika",
  keywords: [
    "The Oven",
    "Arvika restaurang",
    "napolitansk pizza Arvika",
    "vedugnsbakad pizza",
    "pizza Arvika",
    "restaurang Arvika",
    "lunchbuffé Arvika",
    "à la carte Arvika",
    "middag Arvika",
    "italiensk restaurang Arvika",
  ],
  address: {
    street: "Kyrkogatan 20",
    postalCode: "671 31",
    city: "Arvika",
    country: "SE",
  },
  phone: "+46 570 188 80",
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.shortName }],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: siteConfig.url,
    title: siteConfig.shortName,
    description: siteConfig.description,
    siteName: siteConfig.shortName,
    images: [
      {
        url: "/og.png",
        width: 1920,
        height: 1080,
        alt: `${siteConfig.shortName} | Napolitansk pizza i Arvika`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.shortName,
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
  category: "restaurant",
};
