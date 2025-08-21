import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { queries } from '@/lib/sanity/queries'
import Breadcrumb from '@/components/Breadcrumb'
import SearchBar from '@/components/SearchBar'
import { siteConfig } from '@/lib/metadata'

interface PageProps {
  params: {
    slug: string
  }
}

async function getArticle(slug: string) {
  try {
    const article = await client.fetch(queries.articleBySlug, { slug })
    return article
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

async function getRelatedArticles(categoryId: string, currentId: string) {
  try {
    const articles = await client.fetch(queries.relatedArticles, {
      categoryId,
      currentId
    })
    return articles || []
  } catch (error) {
    console.error('Error fetching related articles:', error)
    return []
  }
}

// Generera metadata dynamiskt
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticle(params.slug)
  
  if (!article) {
    return {
      title: 'Artikel inte hittad',
      description: 'Den efterfrågade artikeln kunde inte hittas.'
    }
  }

  const title = article.title
  const description = article.excerpt || article.description || `Läs mer om ${article.title} i vår kunskapsbas.`
  
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      type: 'article',
      url: `${siteConfig.url}/article/${params.slug}`,
      siteName: siteConfig.name,
      locale: 'sv_SE',
      images: article.featuredImage ? [
        {
          url: article.featuredImage.asset.url,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : [
        {
          url: siteConfig.ogImage,
          width: 1920,
          height: 1080,
          alt: title,
        }
      ],
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [siteConfig.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
      images: article.featuredImage ? [article.featuredImage.asset.url] : [siteConfig.ogImage],
    },
    alternates: {
      canonical: `${siteConfig.url}/article/${params.slug}`,
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = article.category?._id 
    ? await getRelatedArticles(article.category._id, article._id)
    : []

  const breadcrumbItems = [
    { label: 'Alla samligar', href: '/' },
    { 
      label: article.category?.title || 'Kategori', 
      href: `/category/${article.category?.slug?.current}` 
    },
    { label: article.title }
  ]

  return (
    <div className="min-h-screen w-full z-20">
      {/* Header med sökruta */}
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar placeholder="Sök efter artiklar..." />
        </div>
      </div>

      {/* Artikel innehåll */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Breadcrumb items={breadcrumbItems} />
        
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold font-display text-foreground mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center text-foreground/70 text-sm space-x-4">
              {article.category && (
                <span className="text-foreground bg-sage/20 hover:bg-sage/30 hover:scale-105 hover:shadow-lg border border-sage/30 px-3 py-1 rounded-full">
                  {article.category.title}
                </span>
              )}
              {article.publishedAt && (
                <span>
                  {new Date(article.publishedAt).toLocaleDateString('sv-SE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
              {article.updatedAt && article.updatedAt !== article.publishedAt && (
                <span>
                  Updated {new Date(article.updatedAt).toLocaleDateString('sv-SE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>
          </header>

          {article.content && (
            <div className="prose prose-lg text-foreground max-w-none">
              <PortableText
                value={article.content}
                components={{
                  block: {
                    h1: ({children}) => <h1 className="text-3xl text-foreground font-bold mt-8 mb-4">{children}</h1>,
                    h2: ({children}) => <h2 className="text-2xl text-foreground  font-semibold mt-6 mb-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-xl text-foreground font-semibold mt-4 mb-2">{children}</h3>,
                    h4: ({children}) => <h4 className="text-lg text-foreground font-semibold mt-3 mb-2">{children}</h4>,
                    normal: ({children}) => <p className="mb-4 text-foreground/90 leading-relaxed">{children}</p>,
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-accent pl-4 italic my-4 text-foreground bg-accent/20 py-2">
                        {children}
                      </blockquote>
                    ),
                  },
                  list: {
                    bullet: ({children}) => <ul className="list-disc text-foreground pl-6 mb-4 space-y-2">{children}</ul>,
                    number: ({children}) => <ol className="list-decimal text-foreground pl-6 mb-4 space-y-2">{children}</ol>,
                  },
                  listItem: {
                    bullet: ({children}) => <li className="leading-relaxed text-foreground">{children}</li>,
                    number: ({children}) => <li className="leading-relaxed text-foreground">{children}</li>,
                  },
                  marks: {
                    link: ({value, children}) => {
                      const target = value?.blank ? '_blank' : undefined
                      return (
                        <a
                          href={value?.href}
                          target={target}
                          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                          className="text-accent hover:underline font-medium"
                        >
                          {children}
                        </a>
                      )
                    },
                    strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                    em: ({children}) => <em className="italic">{children}</em>,
                    code: ({children}) => (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                        {children}
                      </code>
                    ),
                  },
                  types: {
                    image: ({value}) => {
                      if (!value?.asset) return null
                      return (
                        <figure className="my-8">
                          <img
                            src={value.asset.url}
                            alt={value.alt || ''}
                            className="rounded-lg max-w-full h-auto shadow-sm"
                          />
                          {value.alt && (
                            <figcaption className="text-sm text-gray-600 mt-2 text-center italic">
                              {value.alt}
                            </figcaption>
                          )}
                        </figure>
                      )
                    },
                    codeBlock: ({value}) => {
                      if (!value?.code) return null
                      return (
                        <div className="my-6">
                          {value.language && (
                            <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-medium rounded-t-lg">
                              {value.language.toUpperCase()}
                            </div>
                          )}
                          <pre className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto ${value.language ? 'rounded-b-lg' : 'rounded-lg'}`}>
                            <code className={value.language ? `language-${value.language}` : ''}>
                              {value.code}
                            </code>
                          </pre>
                        </div>
                      )
                    },
                    // Fallback för gamla "code" typer
                    code: ({value}) => {
                      if (!value?.code) return null
                      return (
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
                          <code className={value.language ? `language-${value.language}` : ''}>
                            {value.code}
                          </code>
                        </pre>
                      )
                    },
                  },
                }}
              />
            </div>
          )}
        </article>

        {/* Relaterade artiklar sektion */}
        {relatedArticles.length > 0 && (
          <section className="mt-12">
            <div className="border-t border-foreground pt-8">
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                Relaterade artiklar
              </h2>
              <div className="space-y-4">
                {relatedArticles.map((relatedArticle: any) => (
                  <Link key={relatedArticle._id} href={`/article/${relatedArticle.slug.current}`}>
                    <div className="bg-sage/20 border border-sage/30 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <h3 className="font-semibold text-foreground hover:text-accent mb-2">
                        {relatedArticle.title}
                      </h3>
                      {relatedArticle.excerpt && (
                        <p className="text-foreground/70 text-sm line-clamp-2">
                          {relatedArticle.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}