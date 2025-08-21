'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Globe, CaretDown } from '@/components/icons/icons'
import useScroll from '@/lib/hooks/use-scroll'
import { useState, useEffect, useRef } from 'react'
import LanguageSelector from '@/components/LanguageSelector'

// Översättningar för navigationslänkar
const translations = {
  sv: {
    apiDocs: 'API Docs',
    releaseNotes: 'Release Notes',
    support: 'Hur du får support',
    openMenu: 'Öppna mobilmeny',
    closeMenu: 'Stäng mobilmeny'
  },
  en: {
    apiDocs: 'API Docs',
    releaseNotes: 'Release Notes',
    support: 'How to get support',
    openMenu: 'Open mobile menu',
    closeMenu: 'Close mobile menu'
  }
}

export default function Header() {
  const scrolled = useScroll(50)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<'sv' | 'en'>('sv')
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const t = translations[currentLanguage]

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language as 'sv' | 'en')
  }

  // Hantera klick utanför menyn
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        menuButtonRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    // Lägg till event listener när menyn är öppen
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    // Cleanup - ta bort event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

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
          <nav className="hidden md:flex items-center space-x-8" aria-label="Huvudnavigering" role="navigation">
            <Link
              href="#"
              className="text-foreground/70 hover:text-foreground transition-colors font-medium"
            >
              {t.apiDocs}
            </Link>
            <Link
              href="#"
              className="text-foreground/70 hover:text-foreground transition-colors font-medium"
            >
              {t.releaseNotes}
            </Link>
            <Link
              href="https://diavana.se/contact"
              className="text-foreground/70 hover:text-foreground transition-colors font-medium"
            >
              {t.support}
            </Link>

            <LanguageSelector 
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              ref={menuButtonRef}
              className="text-foreground/70 hover:text-foreground transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? t.closeMenu : t.openMenu}
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
        <div 
          ref={mobileMenuRef}
          className="fixed top-16 left-0 w-full border-b border-foreground/20 bg-background/80 backdrop-blur-xl z-40 md:hidden animate-in slide-in-from-top-2 duration-300"
        >
          <nav className="px-5 py-4 space-y-4" role="navigation">
            <Link
              href="/api-docs"
              className="block text-foreground/70 hover:text-foreground transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.apiDocs}
            </Link>
            <Link
              href="/release-notes"
              className="block text-foreground/70 hover:text-foreground transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.releaseNotes}
            </Link>
            <Link
              href="/support"
              className="block text-foreground/70 hover:text-foreground transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.support}
            </Link>

              <LanguageSelector 
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
                className="w-full py-2"
              />
          </nav>
        </div>
      )}
    </>
  )
}