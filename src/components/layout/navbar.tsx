'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Globe, CaretDown } from '@/components/icons/icons'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
        <Link
              href="/"
              className="flex items-center font-display text-2xl tracking-tight text-black"
              aria-label="Gå till startsidan - Diavana"
            >
              <Image
                src="/owl.svg"
                alt="Diavana logo"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="font-medium leading-none translate-y-0.5">Diavana</span>
            </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/api-docs"
              className="text-gray-700 hover:text-anthropic-orange transition-colors font-medium"
            >
              API Docs
            </Link>
            <Link
              href="/release-notes"
              className="text-gray-700 hover:text-anthropic-orange transition-colors font-medium"
            >
              Release Notes
            </Link>
            <Link
              href="/support"
              className="text-gray-700 hover:text-anthropic-orange transition-colors font-medium"
            >
              Hur du får support
            </Link>
            
            <div className="flex items-center space-x-2 text-foreground/70">
              <Globe className="w-4 h-4" />
              <span className="font-medium">Svenska</span>
              <CaretDown className="w-4 h-4" />
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}