import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { client } from '@/lib/sanity'
import { queries } from '@/lib/sanity/queries'
import Breadcrumb from '@/components/Breadcrumb'
import SearchBar from '@/components/SearchBar'

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

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = article.category?._id 
    ? await getRelatedArticles(article.category._id, article._id)
    : []

  const breadcrumbItems = [
    { label: 'All Collections', href: '/' },
    { 
      label: article.category?.title || 'Category', 
      href: `/category/${article.category?.slug?.current}` 
    },
    { label: article.title }
  ]

  return (
    <div className="min-h-screen w-full z-20">
      {/* Header med sökruta */}
      <div className="bg-anthropic-bg py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar placeholder="Search for articles..." />
        </div>
      </div>

      {/* Artikel innehåll */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Breadcrumb items={breadcrumbItems} />
        
        <article className="bg-white rounded-lg p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            {article.excerpt && (
              <p className="text-lg text-gray-600 mb-4">
                {article.excerpt}
              </p>
            )}
            
            <div className="flex items-center text-sm text-gray-600 space-x-4">
              {article.category && (
                <span className="bg-gray-100 px-3 py-1 rounded-full">
                  {article.category.title}
                </span>
              )}
              {article.publishedAt && (
                <span>
                  Published {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
              {article.updatedAt && article.updatedAt !== article.publishedAt && (
                <span>
                  Updated {new Date(article.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>
          </header>

          {article.content && (
            <div className="prose prose-lg max-w-none">
              <PortableText
                value={article.content}
                components={{
                  block: {
                    h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
                    h2: ({children}) => <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>,
                    h4: ({children}) => <h4 className="text-lg font-semibold mt-3 mb-2">{children}</h4>,
                    normal: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-anthropic-orange pl-4 italic my-4 text-gray-700 bg-gray-50 py-2">
                        {children}
                      </blockquote>
                    ),
                  },
                  list: {
                    bullet: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                    number: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                  },
                  listItem: {
                    bullet: ({children}) => <li className="leading-relaxed">{children}</li>,
                    number: ({children}) => <li className="leading-relaxed">{children}</li>,
                  },
                  marks: {
                    link: ({value, children}) => {
                      const target = value?.blank ? '_blank' : undefined
                      return (
                        <a
                          href={value?.href}
                          target={target}
                          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                          className="text-anthropic-orange hover:underline font-medium"
                        >
                          {children}
                        </a>
                      )
                    },
                    strong: ({children}) => <strong className="font-semibold">{children}</strong>,
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
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Related Articles
              </h2>
              <div className="space-y-4">
                {relatedArticles.map((relatedArticle: any) => (
                  <Link key={relatedArticle._id} href={`/article/${relatedArticle.slug.current}`}>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <h3 className="font-semibold text-gray-900 hover:text-anthropic-orange mb-2">
                        {relatedArticle.title}
                      </h3>
                      {relatedArticle.excerpt && (
                        <p className="text-gray-600 text-sm line-clamp-2">
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