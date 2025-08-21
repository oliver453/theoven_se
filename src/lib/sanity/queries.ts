// lib/sanity/queries.ts - Förbättrade sök-queries för enstaka ord
import { groq } from 'next-sanity'

export const queries = {
  // Förenklad och robust artikelsökning
  searchArticles: groq`
    *[_type == "article" && defined(title) && defined(slug.current) && (
      // Grundläggande matchningar
      title match "*" + $searchTerm + "*" ||
      lower(title) match "*" + lower($searchTerm) + "*" ||
      
      // Excerpt matchningar (endast om excerpt finns)
      (defined(excerpt) && excerpt match "*" + $searchTerm + "*") ||
      (defined(excerpt) && lower(excerpt) match "*" + lower($searchTerm) + "*") ||
      
      // Kategori matchningar (endast om kategori finns)
      (defined(category->title) && category->title match "*" + $searchTerm + "*") ||
      (defined(category->title) && lower(category->title) match "*" + lower($searchTerm) + "*") ||
      
      // Innehåll matchningar (endast om content finns)
      (defined(content) && pt::text(content) match "*" + $searchTerm + "*") ||
      (defined(content) && lower(pt::text(content)) match "*" + lower($searchTerm) + "*")
    )] | order(
      // Förenklad prioritering
      select(
        title == $searchTerm => 0,
        lower(title) == lower($searchTerm) => 1,
        title match $searchTerm + "*" => 2,
        lower(title) match lower($searchTerm) + "*" => 3,
        title match "*" + $searchTerm + "*" => 4,
        lower(title) match "*" + lower($searchTerm) + "*" => 5,
        (defined(category->title) && category->title match "*" + $searchTerm + "*") => 6,
        (defined(excerpt) && excerpt match "*" + $searchTerm + "*") => 7,
        10
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
      }
    }
  `,

  // Förbättrad kategorisökning
  searchCategories: groq`
    *[_type == "category" && (
      // Exakt matchning
      title match "*" + $searchTerm + "*" ||
      description match "*" + $searchTerm + "*" ||
      
      // Case-insensitive
      lower(title) match "*" + lower($searchTerm) + "*" ||
      lower(description) match "*" + lower($searchTerm) + "*" ||
      
      // Enstaka ord
      title match "*" + split($searchTerm, " ")[0] + "*" ||
      title match "*" + split($searchTerm, " ")[1] + "*" ||
      lower(title) match "*" + lower(split($searchTerm, " ")[0]) + "*" ||
      lower(title) match "*" + lower(split($searchTerm, " ")[1]) + "*"
    )] | order(
      select(
        title == $searchTerm => 0,
        lower(title) == lower($searchTerm) => 1,
        title match $searchTerm + "*" => 2,
        lower(title) match lower($searchTerm) + "*" => 3,
        title match "*" + $searchTerm + "*" => 4,
        lower(title) match "*" + lower($searchTerm) + "*" => 5,
        10
      ) asc,
      title asc
    ) {
      _id,
      title,
      slug,
      description,
      icon,
      "articleCount": count(*[_type == "article" && references(^._id)]),
      "searchScore": select(
        title == $searchTerm => 100,
        lower(title) == lower($searchTerm) => 95,
        title match "*" + $searchTerm + "*" => 80,
        lower(title) match "*" + lower($searchTerm) + "*" => 75,
        50
      )
    }
  `,

  // Förenklad och mer robust suggestion search
  searchSuggestions: groq`
    {
      "articles": *[_type == "article" && defined(title) && defined(slug.current) && (
        title match "*" + $searchTerm + "*" ||
        lower(title) match "*" + lower($searchTerm) + "*" ||
        (defined(excerpt) && excerpt match "*" + $searchTerm + "*") ||
        (defined(excerpt) && lower(excerpt) match "*" + lower($searchTerm) + "*") ||
        (defined(category->title) && category->title match "*" + $searchTerm + "*") ||
        (defined(category->title) && lower(category->title) match "*" + lower($searchTerm) + "*")
      )] | order(
        select(
          title match $searchTerm + "*" => 0,
          lower(title) match lower($searchTerm) + "*" => 1,
          title match "*" + $searchTerm + "*" => 2,
          lower(title) match "*" + lower($searchTerm) + "*" => 3,
          5
        ) asc,
        publishedAt desc
      ) [0...6] {
        title,
        slug,
        excerpt,
        category-> {
          title,
          slug
        }
      },
      
      "categories": *[_type == "category" && defined(title) && defined(slug.current) && (
        title match "*" + $searchTerm + "*" ||
        lower(title) match "*" + lower($searchTerm) + "*" ||
        (defined(description) && description match "*" + $searchTerm + "*") ||
        (defined(description) && lower(description) match "*" + lower($searchTerm) + "*")
      )] | order(
        select(
          title match $searchTerm + "*" => 0,
          lower(title) match lower($searchTerm) + "*" => 1,
          title match "*" + $searchTerm + "*" => 2,
          5
        ) asc,
        title asc
      ) [0...3] {
        title,
        slug,
        description,
        icon
      }
    }
  `,

  // Kombinerad sökning som returnerar både artiklar och kategorier i en query
  combinedSearch: groq`
    {
      "articles": *[_type == "article" && (
        title match "*" + $searchTerm + "*" ||
        lower(title) match "*" + lower($searchTerm) + "*" ||
        excerpt match "*" + $searchTerm + "*" ||
        lower(excerpt) match "*" + lower($searchTerm) + "*" ||
        pt::text(content) match "*" + $searchTerm + "*" ||
        category->title match "*" + $searchTerm + "*" ||
        title match "*" + split($searchTerm, " ")[0] + "*" ||
        title match "*" + split($searchTerm, " ")[1] + "*" ||
        lower(title) match "*" + lower(split($searchTerm, " ")[0]) + "*" ||
        lower(title) match "*" + lower(split($searchTerm, " ")[1]) + "*"
      )] | order(
        select(
          title == $searchTerm => 0,
          lower(title) == lower($searchTerm) => 1,
          title match $searchTerm + "*" => 2,
          title match "*" + $searchTerm + "*" => 4,
          category->title match "*" + $searchTerm + "*" => 6,
          excerpt match "*" + $searchTerm + "*" => 8,
          10
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
        }
      },
      
      "categories": *[_type == "category" && (
        title match "*" + $searchTerm + "*" ||
        lower(title) match "*" + lower($searchTerm) + "*" ||
        description match "*" + $searchTerm + "*" ||
        title match "*" + split($searchTerm, " ")[0] + "*" ||
        lower(title) match "*" + lower(split($searchTerm, " ")[0]) + "*"
      )] | order(
        select(
          title == $searchTerm => 0,
          lower(title) == lower($searchTerm) => 1,
          title match "*" + $searchTerm + "*" => 4,
          10
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
    }
  `,

  // ... behåll alla andra queries som tidigare
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