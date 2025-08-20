import Link from 'next/link'

interface CategoryCardProps {
  title: string
  articleCount: number
  icon: React.ComponentType<{ className?: string; weight?: string }>
  slug: string
  description?: string
}

export default function CategoryCard({ 
  title, 
  articleCount, 
  icon: Icon, 
  slug, 
  description 
}: CategoryCardProps) {
  return (
    <Link href={`/category/${slug}`}>
      <div className="category-card bg-background rounded-xl border border-foreground/20 p-6 hover:shadow-lg cursor-pointer">
        <div className="flex items-start space-x-4">
          <div className="bg-sage rounded-lg p-3 flex-shrink-0">
            <Icon className="w-6 h-6 text-background" weight="fill" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-2 truncate">
              {title}
            </h3>
            
            {description && (
              <p className="text-foreground/60 text-sm mb-3 line-clamp-2">
                {description}
              </p>
            )}
            
            <p className="text-foreground/50 text-sm">
              {articleCount} {articleCount === 1 ? 'artikel' : 'artiklar'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}