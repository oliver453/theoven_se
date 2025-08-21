import Link from 'next/link'
import { CaretRight } from './icons/icons'

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
      <div className="bg-sage/20 rounded-lg border border-sage/30 p-6 hover:shadow-md transition-shadow cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-2">
              {category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-foreground text-background">
                  {category.title}
                </span>
              )}
              {featured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-white">
                  Utvald
                </span>
              )}
            </div>
                     
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
              {title}
            </h3>
                     
            {excerpt && (
              <p className="text-foreground/80 text-sm line-clamp-2 mb-3">
                {excerpt}
              </p>
            )}
                     
            {publishedAt && (
              <p className="text-xs text-foreground/60">
                {new Date(publishedAt).toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
                 
          <div className="flex-shrink-0 ml-4">
            <CaretRight className="w-5 h-5 text-foreground group-hover:text-accent transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}