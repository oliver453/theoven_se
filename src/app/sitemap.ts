import { MetadataRoute } from "next";
import { client } from "@/lib/sanity";
import { queries } from "@/lib/sanity/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://support.diavana.se";

  // get all categorys from sanity
  const categories = await client.fetch(`
    *[_type == "category" && defined(slug.current)] {
      slug,
      _updatedAt
    }
  `);

  // get all articles from sanity
  const articles = await client.fetch(`
    *[_type == "article" && defined(slug.current)] {
      slug,
      _updatedAt,
      publishedAt
    }
  `);

  //  sitemap entries for categorys
  const categoryEntries: MetadataRoute.Sitemap = categories.map(
    (category: any) => ({
      url: `${baseUrl}/category/${category.slug.current}`,
      lastModified: new Date(category._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }),
  );

  // articles
  const articleEntries: MetadataRoute.Sitemap = articles.map(
    (article: any) => ({
      url: `${baseUrl}/article/${article.slug.current}`,
      lastModified: new Date(article._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  // combine all entries
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    ...categoryEntries,
    ...articleEntries,
  ];
}
