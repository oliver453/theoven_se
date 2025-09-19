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
  // Engelska översättningar
  en: {
    name: "The Oven | Authentic Neapolitan Pizza in Arvika",
    description:
      "We serve authentic Neapolitan pizza baked in a wood-fired oven, lunch buffet and à la carte. With carefully selected ingredients and genuine service, you get a dining experience beyond the ordinary. Welcome to us at Kyrkogatan 20 in Arvika.",
    keywords: [
      "The Oven",
      "Arvika restaurant",
      "Neapolitan pizza Arvika",
      "wood-fired pizza",
      "pizza Arvika",
      "restaurant Arvika",
      "lunch buffet Arvika",
      "à la carte Arvika",
      "dinner Arvika",
      "Italian restaurant Arvika",
    ],
  },
};

// Svenska bas-metadata (default)
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "The Oven | Äkta napolitansk pizza i Arvika", // ← Direkt titel, ingen template
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.shortName }],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: siteConfig.url,
    title: "The Oven | Äkta napolitansk pizza i Arvika",
    description: siteConfig.description,
    siteName: siteConfig.shortName,
    images: [
      {
        url: "/og.png",
        width: 1920,
        height: 1080,
        alt: "The Oven | Äkta napolitansk pizza i Arvika",
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
  verification: {
    google: "1xyjYRSepMna-uvd6Ba2qJnSHDihdXm-crC6jNcpF7I",
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      en: `${siteConfig.url}/en`,
    },
  },
  category: "restaurant",
};

// Engelska bas-metadata
export const englishMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "The Oven | Authentic Neapolitan Pizza in Arvika", // ← Direkt titel utan template
  description: siteConfig.en.description,
  keywords: siteConfig.en.keywords,
  authors: [{ name: siteConfig.shortName }],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteConfig.url}/en`,
    title: "The Oven | Authentic Neapolitan Pizza in Arvika",
    description: siteConfig.en.description,
    siteName: siteConfig.shortName,
    images: [
      {
        url: "/og.png",
        width: 1920,
        height: 1080,
        alt: "The Oven | Authentic Neapolitan Pizza in Arvika",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.shortName,
    description: siteConfig.en.description,
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
    google: "1xyjYRSepMna-uvd6Ba2qJnSHDihdXm-crC6jNcpF7I",
  },
  alternates: {
    canonical: `${siteConfig.url}/en`,
    languages: {
      sv: siteConfig.url,
    },
  },
  category: "restaurant",
};

// Svenska meny-metadata
export const menuMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Meny | The Oven",
  description: "Upptäck vår meny med äkta napolitansk pizza, förrätter, huvudrätter och efterrätter. Alla rätter tillagas med noggrant utvalda ingredienser och bakas i vår vedugn.",
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
    "pizza meny Arvika",
    "napolitansk pizza meny",
    "vedugnsbakad pizza meny",
    "italiensk restaurang meny",
    "restaurang meny Arvika",
  ],
  authors: [{ name: siteConfig.shortName }],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: `${siteConfig.url}/meny`,
    title: "Meny | The Oven",
    description: "Upptäck vår meny med äkta napolitansk pizza, förrätter, huvudrätter och efterrätter. Alla rätter tillagas med noggrant utvalda ingredienser och bakas i vår vedugn.",
    siteName: siteConfig.shortName,
    images: [
      {
        url: "/og.png",
        width: 1920,
        height: 1080,
        alt: "Meny | The Oven",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meny | The Oven",
    description: "Upptäck vår meny med äkta napolitansk pizza, förrätter, huvudrätter och efterrätter.",
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
    google: "1xyjYRSepMna-uvd6Ba2qJnSHDihdXm-crC6jNcpF7I",
  },
  alternates: {
    canonical: `${siteConfig.url}/meny`,
    languages: {
      sv: `${siteConfig.url}/meny`,
      en: `${siteConfig.url}/en/meny`,
    },
  },
  category: "restaurant",
};

// Engelska meny-metadata
export const englishMenuMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Menu | The Oven",
  description: "Discover our menu with authentic Neapolitan pizzas, starters, main courses and desserts. All dishes are prepared with carefully selected ingredients and baked in our wood-fired oven.",
  keywords: [
    "The Oven",
    "Arvika restaurant",
    "Neapolitan pizza Arvika",
    "wood-fired pizza",
    "pizza Arvika",
    "restaurant Arvika",
    "lunch buffet Arvika",
    "à la carte Arvika",
    "dinner Arvika",
    "Italian restaurant Arvika",
    "pizza menu Arvika",
    "Neapolitan pizza menu",
    "wood-fired pizza menu",
    "Italian restaurant menu",
    "restaurant menu Arvika",
  ],
  authors: [{ name: siteConfig.shortName }],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteConfig.url}/en/meny`,
    title: "Menu | The Oven",
    description: "Discover our menu with authentic Neapolitan pizzas, starters, main courses and desserts. All dishes are prepared with carefully selected ingredients and baked in our wood-fired oven.",
    siteName: siteConfig.shortName,
    images: [
      {
        url: "/og.png",
        width: 1920,
        height: 1080,
        alt: "Menu | The Oven",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Menu | The Oven",
    description: "Discover our menu with authentic Neapolitan pizzas, starters, main courses and desserts.",
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
    google: "1xyjYRSepMna-uvd6Ba2qJnSHDihdXm-crC6jNcpF7I",
  },
  alternates: {
    canonical: `${siteConfig.url}/en/meny`,
    languages: {
      sv: `${siteConfig.url}/meny`,
      en: `${siteConfig.url}/en/meny`,
    },
  },
  category: "restaurant",
};