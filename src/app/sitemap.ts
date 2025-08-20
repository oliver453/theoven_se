import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://diavana.se";

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/legal/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/legal/cookie-policy`, lastModified: new Date() },
    { url: `${baseUrl}/download`, lastModified: new Date() },
  ];
}
