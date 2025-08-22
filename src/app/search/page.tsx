import { Suspense } from "react";
import { client } from "@/lib/sanity";
import { queries } from "@/lib/sanity/queries";
import SearchBar from "@/components/SearchBar";
import ArticleCard from "@/components/ArticleCard";
import CategoryCard from "@/components/CategoryCard";
import Breadcrumb from "@/components/Breadcrumb";
import { CategoryIcons } from "@/components/icons/icons";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

async function searchArticles(query: string) {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const articles = await client.fetch(queries.searchArticles, {
      searchTerm: query,
    });
    return articles || [];
  } catch (error) {
    console.error("Fel vid sökning av artiklar:", error);
    return [];
  }
}

async function searchCategories(query: string) {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const categories = await client.fetch(queries.searchCategories, {
      searchTerm: query,
    });
    return categories || [];
  } catch (error) {
    console.error("Fel vid sökning av kategorier:", error);
    return [];
  }
}

function SearchResults({ query }: { query: string }) {
  return (
    <Suspense fallback={<div>Söker...</div>}>
      <SearchResultsContent query={query} />
    </Suspense>
  );
}

async function SearchResultsContent({ query }: { query: string }) {
  const [articles, categories] = await Promise.all([
    searchArticles(query),
    searchCategories(query),
  ]);

  if (!query || query.length < 2) {
    return (
      <p className="text-center text-foreground">
        Skriv minst 2 tecken för att söka efter artiklar och kategorier.
      </p>
    );
  }

  const totalResults = articles.length + categories.length;

  if (totalResults === 0) {
    return (
      <div className="text-center">
        <p className="mb-2 text-foreground">
          Inga artiklar eller kategorier hittades för "{query}"
        </p>
        <p className="text-sm text-foreground/70">
          Prova andra sökord eller bläddra bland våra kategorier.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Kategoriresultat */}
      {categories.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Kategorier ({categories.length})
          </h2>
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {categories.map((category: any) => (
              <CategoryCard
                key={category._id}
                title={category.title}
                articleCount={category.articleCount}
                icon={
                  CategoryIcons[category.icon as keyof typeof CategoryIcons] ||
                  CategoryIcons.chat
                }
                slug={category.slug.current}
                description={category.description}
              />
            ))}
          </div>
        </div>
      )}

      {/* Artikelresultat */}
      {articles.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Artiklar ({articles.length})
          </h2>
          <div className="flex flex-col gap-4">
            {articles.map((article: any) => (
              <ArticleCard
                key={article._id}
                title={article.title}
                excerpt={article.excerpt}
                slug={article.slug.current}
                publishedAt={article.publishedAt}
                category={article.category}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sammanfattning */}
      <div className="mt-6 border-t border-foreground pt-4">
        <p className="text-sm text-foreground/70">
          Hittade {totalResults} totalt{" "}
          {totalResults === 1 ? "resultat" : "resultat"} för "{query}"
        </p>
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";

  const breadcrumbItems = [
    { label: "Alla samlingar", href: "/" },
    { label: "Sök" },
  ];

  return (
    <div className="z-20 min-h-screen w-full">
      {/* Header med sökruta */}
      <div className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SearchBar placeholder="Sök efter artiklar..." />
        </div>
      </div>

      {/* Sökresultat */}
      <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <SearchResults query={query} />
      </div>
    </div>
  );
}
