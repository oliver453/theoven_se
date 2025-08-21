// app/category/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { client } from '@/lib/sanity'
import { queries } from '@/lib/sanity/queries'
import Breadcrumb from '@/components/Breadcrumb'
import SearchBar from '@/components/SearchBar'
import ArticleCard from '@/components/ArticleCard'
import CategoryIcon from '@/components/CategoryIcons'

interface PageProps {
  params: {
    slug: string
  }
}

async function getCategoryWithArticles(slug: string) {
  try {
    const category = await client.fetch(queries.categoryWithArticles, { slug })
    return category
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await getCategoryWithArticles(params.slug)

  if (!category) {
    notFound()
  }

  const breadcrumbItems = [
    { label: 'All Collections', href: '/' },
    { label: category.title }
  ]

  return (
    <div className="min-h-screen w-full z-20">
      {/* Header med sökruta */}
      <div className="bg-anthropic-bg py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar placeholder="Search for articles..." />
        </div>
      </div>

      {/* Kategori innehåll */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Kategori header */}
        <div className="flex items-center mb-8">
          <div className="bg-anthropic-orange rounded-lg p-4 mr-4">
            <CategoryIcon 
              icon={category.icon || 'general'} 
              className="w-8 h-8 text-white" 
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {category.title}
            </h1>
            <p className="text-gray-600">
              {category.articles?.length || 0} articles
            </p>
          </div>
        </div>

        {/* Beskrivning */}
        {category.description && (
          <div className="bg-white rounded-lg p-6 mb-8">
            <p className="text-gray-700 leading-relaxed">
              {category.description}
            </p>
          </div>
        )}

        {/* Artiklar */}
        {category.articles && category.articles.length > 0 ? (
          <div className="space-y-4">
            {category.articles.map((article: any) => (
              <ArticleCard
                key={article._id}
                title={article.title}
                excerpt={article.excerpt}
                slug={article.slug.current}
                publishedAt={article.publishedAt}
                category={article.category}
                featured={article.featured}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">
              No articles found in this category yet.
            </p>
            <Link
              href="/"
              className="text-anthropic-orange hover:underline"
            >
              Browse all categories
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}