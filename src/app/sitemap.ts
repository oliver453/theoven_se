import { MetadataRoute } from "next";
import { client } from '@/lib/sanity'
import { queries } from '@/lib/sanity/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://support.diavana.se";

  // Hämta alla kategorier från Sanity
  const categories = await client.fetch(`
    *[_type == "category" && defined(slug.current)] {
      slug,
      _updatedAt
    }
  `)

  // Hämta alla artiklar från Sanity
  const articles = await client.fetch(`
    *[_type == "article" && defined(slug.current)] {
      slug,
      _updatedAt,
      publishedAt
    }
  `)

  // Skapa sitemap entries för kategorier
  const categoryEntries: MetadataRoute.Sitemap = categories.map((category: any) => ({
    url: `${baseUrl}/category/${category.slug.current}`,
    lastModified: new Date(category._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Skapa sitemap entries för artiklar
  const articleEntries: MetadataRoute.Sitemap = articles.map((article: any) => ({
    url: `${baseUrl}/article/${article.slug.current}`,
    lastModified: new Date(article._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Kombinera alla entries
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...categoryEntries,
    ...articleEntries,
  ];
}