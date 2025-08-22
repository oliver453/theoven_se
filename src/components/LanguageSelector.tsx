"use client";
import { useState, useRef, useEffect } from "react";
import { Globe, CaretDown } from "@/components/icons/icons";

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: "sv", name: "Svenska" },
  { code: "en", name: "English" },
];

interface LanguageSelectorProps {
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
  className?: string;
}

export default function LanguageSelector({
  currentLanguage = "sv",
  onLanguageChange,
  className = "",
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange?.(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-foreground/70 transition-colors hover:text-foreground"
        aria-label={`Välj språk, nuvarande: ${currentLang.name}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="h-4 w-4" />
        <span className="font-medium">{currentLang.name}</span>
        <CaretDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="animate-in slide-in-from-top-2 absolute right-0 top-full z-50 mt-2 w-40 rounded-lg border border-foreground/20 bg-background shadow-lg backdrop-blur-xl duration-200">
          <div className="py-1">
            {languages.map((language, index) => (
              <div key={language.code}>
                <button
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
                    currentLanguage === language.code ? "bg-foreground/0" : ""
                  }`}
                  role="menuitem"
                >
                  <span className="font-medium text-foreground">
                    {language.name}
                  </span>
                  {currentLanguage === language.code && (
                    <span className="text-sm text-foreground/50">✓</span>
                  )}
                </button>
                {index < languages.length - 1 && (
                  <div className="mx-2 border-b border-foreground/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
