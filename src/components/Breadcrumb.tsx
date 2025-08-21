'use client'

import Link from 'next/link'
import { CaretRight } from './icons/icons'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex flex-wrap items-center gap-y-1 text-sm text-foreground/70 mb-6">
      {items.map((item, index) => (
        <>
          {index > 0 && (
            <CaretRight key={`arrow-${index}`} className="w-4 h-4 text-foreground mx-2" />
          )}
          
          <div key={index} className="flex items-center">
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={index === items.length - 1 ? 'text-foreground font-medium' : ''}>
                {item.label}
              </span>
            )}
          </div>
        </>
      ))}
    </nav>
  )
}