import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://theoven.se";
  const currentDate = new Date();

  return [
    // Root
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1.0,
      alternates: {
        languages: {
          sv: `${baseUrl}/sv`,
          en: `${baseUrl}/en`,
        },
      },
    },
    // Svenska sidor
    {
      url: `${baseUrl}/sv`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/sv/meny`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en/meny`,
        },
      },
    },
    // Engelska sidor
    {
      url: `${baseUrl}/en`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1.0,
      alternates: {
        languages: {
          sv: `${baseUrl}/sv`,
        },
      },
    },
    {
      url: `${baseUrl}/en/meny`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: {
        languages: {
          sv: `${baseUrl}/sv/meny`,
        },
      },
    },
  ];
}