import Link from 'next/link'
import CategoryIcon from '@/components/CategoryIcons'
import React from 'react'
import { IconWeight } from '@phosphor-icons/react'

interface CategoryCardProps {
  title: string
  articleCount: number
  icon: React.ComponentType<{ className?: string; weight?: IconWeight }> | string
  slug: string
  description?: string
}

export default function CategoryCard({ 
  title, 
  articleCount, 
  icon, 
  slug, 
  description 
}: CategoryCardProps) {
  return (
    <Link href={`/category/${slug}`}>
      <div className="category-card bg-sage/20 rounded-xl border border-sage/30 p-6 hover:shadow-lg cursor-pointer">
        <div className="flex items-start space-x-4">
          <div className="bg-accent rounded-lg p-3 flex-shrink-0">
            {typeof icon === 'string' ? (
              <CategoryIcon icon={icon} className="w-6 h-6 text-white" />
            ) : (
              React.createElement(icon, { className: "w-6 h-6 text-white", weight: "fill" as IconWeight })
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-2 truncate">
              {title}
            </h3>
            
            {description && (
              <p className="text-foreground/80 text-sm mb-3 line-clamp-2">
                {description}
              </p>
            )}
            
            <p className="text-foreground/60 text-sm">
              {articleCount} {articleCount === 1 ? 'artikel' : 'artiklar'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}