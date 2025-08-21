import { Suspense } from 'react'
import { client } from '@/lib/sanity'
import { queries } from '@/lib/sanity/queries'
import SearchBar from '@/components/SearchBar'
import ArticleCard from '@/components/ArticleCard'
import CategoryCard from '@/components/CategoryCard'
import Breadcrumb from '@/components/Breadcrumb'
import { getCategoryIcon } from '@/components/CategoryIcons'

interface SearchPageProps {
  searchParams: {
    q?: string
  }
}

async function searchArticles(query: string) {
  if (!query || query.length < 2) {
    return []
  }

  try {
    const articles = await client.fetch(queries.searchArticles, {
      searchTerm: query
    })
    return articles || []
  } catch (error) {
    console.error('Fel vid sökning av artiklar:', error)
    return []
  }
}

async function searchCategories(query: string) {
  if (!query || query.length < 2) {
    return []
  }

  try {
    const categories = await client.fetch(queries.searchCategories, {
      searchTerm: query
    })
    return categories || []
  } catch (error) {
    console.error('Fel vid sökning av kategorier:', error)
    return []
  }
}

function SearchResults({ query }: { query: string }) {
  return (
    <Suspense fallback={<div>Söker...</div>}>
      <SearchResultsContent query={query} />
    </Suspense>
  )
}

async function SearchResultsContent({ query }: { query: string }) {
  const [articles, categories] = await Promise.all([
    searchArticles(query),
    searchCategories(query)
  ])

  if (!query || query.length < 2) {
    return (
        <p className="text-foreground text-center">
          Skriv minst 2 tecken för att söka efter artiklar och kategorier.
        </p>
    )
  }

  const totalResults = articles.length + categories.length

  if (totalResults === 0) {
    return (
      <div className="text-center">
        <p className="text-foreground mb-2">
          Inga artiklar eller kategorier hittades för "{query}"
        </p>
        <p className="text-sm text-foreground/70">
          Prova andra sökord eller bläddra bland våra kategorier.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Kategoriresultat */}
      {categories.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Kategorier ({categories.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {categories.map((category: any) => (
              <CategoryCard
                key={category._id}
                title={category.title}
                articleCount={category.articleCount}
                icon={getCategoryIcon(category.icon)}
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
          <h2 className="text-xl font-semibold text-foreground mb-4">
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
      <div className="mt-6 pt-4 border-t border-foreground">
        <p className="text-sm text-foreground/70">
          Hittade {totalResults} totalt {totalResults === 1 ? 'resultat' : 'resultat'} för "{query}"
        </p>
      </div>
    </div>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''

  const breadcrumbItems = [
    { label: 'Alla samlingar', href: '/' },
    { label: 'Sök' }
  ]

  return (
    <div className="min-h-screen w-full z-20">
      {/* Header med sökruta */}
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar placeholder="Sök efter artiklar..." />
        </div>
      </div>

      {/* Sökresultat */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Breadcrumb items={breadcrumbItems} />
        
        <SearchResults query={query} />
      </div>
    </div>
  )
}