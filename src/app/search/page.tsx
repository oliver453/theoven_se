// app/search/page.tsx
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
    console.error('Error searching articles:', error)
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
    console.error('Error searching categories:', error)
    return []
  }
}

function SearchResults({ query }: { query: string }) {
  return (
    <Suspense fallback={<div>Searching...</div>}>
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
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-600">
          Enter at least 2 characters to search for articles and categories.
        </p>
      </div>
    )
  }

  const totalResults = articles.length + categories.length

  if (totalResults === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-600 mb-2">
          No articles or categories found for "{query}"
        </p>
        <p className="text-sm text-gray-500">
          Try different keywords or browse our categories.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Categories Results */}
      {categories.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Categories ({categories.length})
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

      {/* Articles Results */}
      {articles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Articles ({articles.length})
          </h2>
          <div className="space-y-4">
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

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Found {totalResults} total {totalResults === 1 ? 'result' : 'results'} for "{query}"
        </p>
      </div>
    </div>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''

  const breadcrumbItems = [
    { label: 'All Collections', href: '/' },
    { label: 'Search' }
  ]

  return (
    <div className="min-h-screen w-full z-20">
      {/* Header med sökruta */}
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar placeholder="Search for articles..." />
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