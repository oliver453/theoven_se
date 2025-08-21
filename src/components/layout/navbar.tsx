'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Globe, CaretDown } from '@/components/icons/icons'
import useScroll from '@/lib/hooks/use-scroll'
import { useState } from 'react'

export default function Header() {
  const scrolled = useScroll(50)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header 
        className={`fixed top-0 flex w-full justify-center ${
          scrolled
            ? "border-b border-foreground/20 bg-background/80 backdrop-blur-xl"
            : "bg-transparent"
        } z-30 transition-all`}
        role="banner"
      >
        <div className="mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center font-display text-2xl tracking-tight text-foreground"
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" aria-label="Huvudnavigering" role="navigation">
            <Link
              href="/api-docs"
              className="text-foreground/70 hover:text-foreground transition-colors font-medium"
            >
              API Docs
            </Link>
            <Link
              href="/release-notes"
              className="text-foreground/70 hover:text-foreground transition-colors font-medium"
            >
              Release Notes
            </Link>
            <Link
              href="/support"
              className="text-foreground/70 hover:text-foreground transition-colors font-medium"
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
            <button 
              className="text-foreground/70 hover:text-foreground transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Stäng mobilmeny" : "Öppna mobilmeny"}
            >
              <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full border-b border-foreground/20 bg-background/80 backdrop-blur-xl z-40 md:hidden animate-in slide-in-from-top-2 duration-300">
          <nav className="px-5 py-4 space-y-4" role="navigation">
            <Link
              href="/api-docs"
              className="block text-foreground/70 hover:text-foreground transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              API Docs
            </Link>
            <Link
              href="/release-notes"
              className="block text-foreground/70 hover:text-foreground transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Release Notes
            </Link>
            <Link
              href="/support"
              className="block text-foreground/70 hover:text-foreground transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Hur du får support
            </Link>

            <div className="flex items-center space-x-2 text-foreground/70 py-2">
              <Globe className="w-4 h-4" />
              <span className="font-medium">Svenska</span>
              <CaretDown className="w-4 h-4" />
            </div>
          </nav>
        </div>
      )}
    </>
  )
}