import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface ArticleCardProps {
  title: string
  excerpt?: string
  slug: string
  publishedAt?: string
  category?: {
    title: string
    slug: { current: string }
    icon?: string
  }
  featured?: boolean
}

export default function ArticleCard({
  title,
  excerpt,
  slug,
  publishedAt,
  category,
  featured
}: ArticleCardProps) {
  return (
    <Link href={`/article/${slug}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-2">
              {category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {category.title}
                </span>
              )}
              {featured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-anthropic-orange text-white">
                  Featured
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-anthropic-orange transition-colors">
              {title}
            </h3>
            
            {excerpt && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {excerpt}
              </p>
            )}
            
            {publishedAt && (
              <p className="text-xs text-gray-500">
                Published {new Date(publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
          
          <div className="flex-shrink-0 ml-4">
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-anthropic-orange transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}