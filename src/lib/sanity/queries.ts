// lib/sanity/queries.ts - Förbättrade sök-queries
import { groq } from 'next-sanity'

export const queries = {
  // ... andra queries ...

  // Förbättrad artikelsökning med fler matchnings-alternativ
  searchArticles: groq`
    *[_type == "article" && (
      // Exakt matchning av titel
      title match "*" + $searchTerm + "*" ||
      // Exakt matchning av sammanfattning
      excerpt match "*" + $searchTerm + "*" ||
      // Sökning i innehåll
      pt::text(content) match "*" + $searchTerm + "*" ||
      // Sökning på kategorinamn
      category->title match "*" + $searchTerm + "*" ||
      // Sökning på delar av orden (för "how to" typ sökningar)
      title match "*" + split($searchTerm, " ")[0] + "*" ||
      title match "*" + split($searchTerm, " ")[1] + "*" ||
      // Case-insensitive sökning
      lower(title) match "*" + lower($searchTerm) + "*" ||
      lower(excerpt) match "*" + lower($searchTerm) + "*"
    )] | order(
      // Prioritera exakta matchningar i titel
      select(
        title match $searchTerm => 0,
        title match "*" + $searchTerm + "*" => 1,
        category->title match "*" + $searchTerm + "*" => 2,
        3
      ) asc,
      publishedAt desc
    ) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      featured,
      category-> {
        title,
        slug,
        icon
      },
      // Lägg till score för relevans
      "searchScore": select(
        title match $searchTerm => 100,
        title match "*" + $searchTerm + "*" => 80,
        excerpt match "*" + $searchTerm + "*" => 60,
        category->title match "*" + $searchTerm + "*" => 40,
        20
      )
    }
  `,

  // Förbättrad kategorisökning
  searchCategories: groq`
    *[_type == "category" && (
      lower(title) match "*" + lower($searchTerm) + "*" ||
      lower(description) match "*" + lower($searchTerm) + "*" ||
      title match "*" + $searchTerm + "*" ||
      description match "*" + $searchTerm + "*"
    )] | order(
      select(
        title match $searchTerm => 0,
        title match "*" + $searchTerm + "*" => 1,
        2
      ) asc,
      title asc
    ) {
      _id,
      title,
      slug,
      description,
      icon,
      "articleCount": count(*[_type == "article" && references(^._id)])
    }
  `,

  // Suggestion search - för autocomplete
  searchSuggestions: groq`
    {
      "articles": *[_type == "article" && title match "*" + $searchTerm + "*"] | order(publishedAt desc) [0...5] {
        title,
        slug
      },
      "categories": *[_type == "category" && title match "*" + $searchTerm + "*"] | order(title asc) [0...3] {
        title,
        slug
      }
    }
  `,

  // ... resten av queries:n behålls som tidigare
  articleBySlug: groq`
    *[_type == "article" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      updatedAt,
      featured,
      category-> {
        _id,
        title,
        slug,
        description,
        icon
      }
    }
  `,

  allCategories: groq`
    *[_type == "category"] | order(order asc, title asc) {
      _id,
      title,
      slug,
      description,
      icon,
      order,
      "articleCount": count(*[_type == "article" && references(^._id)])
    }
  `,

  categoryWithArticles: groq`
    *[_type == "category" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      icon,
      "articles": *[_type == "article" && references(^._id)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        updatedAt,
        featured,
        category-> {
          title,
          slug
        }
      }
    }
  `,

  allArticles: groq`
    *[_type == "article"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      featured,
      category-> {
        title,
        slug,
        icon
      }
    }
  `,

  featuredArticles: groq`
    *[_type == "article" && featured == true] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      category-> {
        title,
        slug,
        icon
      }
    }
  `,

  relatedArticles: groq`
    *[_type == "article" && category._ref == $categoryId && _id != $currentId] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      category-> {
        title,
        slug
      }
    }
  `
}