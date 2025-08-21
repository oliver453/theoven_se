'use client'
import { useState, useRef, useEffect } from 'react'
import { Globe, CaretDown } from '@/components/icons/icons'

interface Language {
  code: string
  name: string
}

const languages: Language[] = [
  { code: 'sv', name: 'Svenska' },
  { code: 'en', name: 'English' }
]

interface LanguageSelectorProps {
  currentLanguage?: string
  onLanguageChange?: (language: string) => void
  className?: string
}

export default function LanguageSelector({ 
  currentLanguage = 'sv', 
  onLanguageChange,
  className = ''
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange?.(languageCode)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-foreground/70 hover:text-foreground transition-colors"
        aria-label={`Välj språk, nuvarande: ${currentLang.name}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-4 h-4" />
        <span className="font-medium">{currentLang.name}</span>
        <CaretDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-40 bg-background border border-foreground/20 rounded-lg shadow-lg backdrop-blur-xl z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {languages.map((language, index) => (
              <div key={language.code}>
                <button
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                    currentLanguage === language.code ? 'bg-foreground/0' : ''
                  }`}
                  role="menuitem"
                >
                  <span className="font-medium text-foreground">{language.name}</span>
                  {currentLanguage === language.code && (
                    <span className="text-foreground/50 text-sm">✓</span>
                  )}
                </button>
                {index < languages.length - 1 && (
                  <div className="border-b border-foreground/10 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}