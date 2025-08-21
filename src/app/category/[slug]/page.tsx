import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { queries } from '@/lib/sanity/queries'
import Breadcrumb from '@/components/Breadcrumb'
import SearchBar from '@/components/SearchBar'
import ArticleCard from '@/components/ArticleCard'
import CategoryIcon from '@/components/CategoryIcons'
import { siteConfig } from '@/lib/metadata'

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

// Generera metadata dynamiskt
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await getCategoryWithArticles(params.slug)
  
  if (!category) {
    return {
      title: 'Kategori inte hittad',
      description: 'Den efterfrågade kategorin kunde inte hittas.'
    }
  }

  const articleCount = category.articles?.length || 0
  const articleText = articleCount === 1 ? 'artikel' : 'artiklar'
  const title = category.title
  const description = category.description || `Utforska ${articleCount} ${articleText} inom ${category.title} i vår kunskapsbas.`
  
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      type: 'website',
      url: `${siteConfig.url}/category/${params.slug}`,
      siteName: siteConfig.name,
      locale: 'sv_SE',
      images: [
        {
          url: siteConfig.ogImage,
          width: 1920,
          height: 1080,
          alt: `${title} - ${siteConfig.name}`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [siteConfig.ogImage],
    },
    alternates: {
      canonical: `${siteConfig.url}/category/${params.slug}`,
    },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await getCategoryWithArticles(params.slug)

  if (!category) {
    notFound()
  }

  const articleCount = category.articles?.length || 0
  const articleText = articleCount === 1 ? 'artikel' : 'artiklar'

  const breadcrumbItems = [
    { label: 'Alla samlingar', href: '/' },
    { label: category.title }
  ]

  return (
    <div className="min-h-screen w-full z-20">
      {/* Header med sökruta */}
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar placeholder="Sök efter artiklar..." />
        </div>
      </div>

      {/* Kategori innehåll */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Breadcrumb items={breadcrumbItems} />
                
        {/* Kategori header */}
        <div className="flex items-center mb-4">
          <div className="rounded-lg p-4 mr-4 bg-accent">
            <CategoryIcon 
              icon={category.icon || 'general'}
              className="w-8 h-8 text-white"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground font-display">
              {category.title}
            </h1>
            <p className="text-foreground/70">
              {articleCount} {articleText}
            </p>
          </div>
        </div>

        {/* Beskrivning */}
        {category.description && (
            <p className="text-foreground/70 leading-relaxed mb-8">
              {category.description}
            </p>
        )}

        {/* Artiklar */}
        {category.articles && category.articles.length > 0 ? (
          <div className="flex flex-col gap-4">
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
          <div className="text-center">
            <p className="text-foreground mb-4">
              Inga artiklar hittades i denna kategori ännu.
            </p>
            <Link
              href="/"
              className="text-accent hover:underline"
            >
              Bläddra bland alla kategorier
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}