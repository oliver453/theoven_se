import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://theoven.se";

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/meny`, lastModified: new Date() },
  ];  
}
