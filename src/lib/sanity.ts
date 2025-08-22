import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: process.env.NODE_ENV === "production",
  apiVersion: "2023-10-01",
  token: process.env.SANITY_TOKEN, // Only needed for mutations
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => builder.image(source);

// Types för TypeScript
export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  icon: string;
  order?: number;
}

export interface Article {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  content: any[];
  category: {
    _ref: string;
    title?: string;
    slug?: {
      current: string;
    };
  };
  publishedAt: string;
  updatedAt: string;
  featured?: boolean;
}

// Queries
export const queries = {
  categories: `
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

  articlesByCategory: `
    *[_type == "article" && category._ref == $categoryId] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      updatedAt,
      featured,
      category->{
        title,
        slug
      }
    }
  `,

  articleBySlug: `
    *[_type == "article" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      updatedAt,
      category->{
        _id,
        title,
        slug
      }
    }
  `,

  searchArticles: `
    *[_type == "article" && (
      title match $query || 
      excerpt match $query || 
      pt::text(content) match $query
    )] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      category->{
        title,
        slug
      }
    }
  `,
};
