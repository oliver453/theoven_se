"use client";
import Link from "next/link";
import Image from "next/image";
import { Globe, CaretDown } from "@/components/icons/icons";
import useScroll from "@/lib/hooks/use-scroll";
import { useState, useEffect, useRef } from "react";
import LanguageSelector from "@/components/LanguageSelector";

// Översättningar för navigationslänkar
const translations = {
  sv: {
    status: "Driftstatus",
    releaseNotes: "Ändringsloggar",
    support: "Hur du får support",
    openMenu: "Öppna mobilmeny",
    closeMenu: "Stäng mobilmeny",
  },
  en: {
    status: "Status",
    releaseNotes: "Release Notes",
    support: "How to get support",
    openMenu: "Open mobile menu",
    closeMenu: "Close mobile menu",
  },
};

export default function Header() {
  const scrolled = useScroll(50);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<"sv" | "en">("sv");
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const t = translations[currentLanguage];

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language as "sv" | "en");
  };

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
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`
          fixed left-0 right-0 top-0 z-30
          transition-all duration-200 ease-out
          ${
            scrolled
              ? "border-b border-foreground/20 bg-background/80 backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
          }
        `}
        role="banner"
      >
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
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
            <span className="translate-y-0.5 font-medium leading-none">
              Diavana
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center space-x-8 md:flex"
            aria-label="Huvudnavigering"
          >
            <Link
              href="https://status.diavana.se"
              className="font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {t.status}
            </Link>
            <Link
              href="/changelog"
              className="font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {t.releaseNotes}
            </Link>
            <Link
              href="https://diavana.se/contact"
              className="font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {t.support}
            </Link>

            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </nav>

          {/* Mobile menu button */}
          <button
            ref={menuButtonRef}
            className="p-2 text-foreground/70 transition-colors hover:text-foreground md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? t.closeMenu : t.openMenu}
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-x-0 top-16 z-40 border-b border-foreground/20 bg-background/80 backdrop-blur-xl md:hidden"
        >
          <nav className="space-y-1 px-6 py-4">
            <Link
              href="https://status.diavana.se"
              className="block rounded-md px-3 py-2 font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.status}
            </Link>
            <Link
              href="/changelog"
              className="block rounded-md px-3 py-2 font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.releaseNotes}
            </Link>
            <Link
              href="https://diavana.se/contact"
              className="block rounded-md px-3 py-2 font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.support}
            </Link>

            <div className="pt-2">
              <LanguageSelector
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
              />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
