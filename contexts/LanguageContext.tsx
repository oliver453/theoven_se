"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import svTranslations from "../locales/sv.json";
import enTranslations from "../locales/en.json";

type Language = "sv" | "en";
type Translations = typeof svTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isInitialized: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const translations = {
  sv: svTranslations,
  en: enTranslations,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("sv");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Initial språkinställning - kör bara en gång
  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized) {
      const savedLang = localStorage.getItem("lang");
      let initialLang: Language = "sv";

      // Bestäm språk baserat på URL först
      if (pathname.startsWith("/en")) {
        initialLang = "en";
        setLanguage("en");
        setIsInitialized(true);
      } else if (savedLang && (savedLang === "sv" || savedLang === "en")) {
        initialLang = savedLang as Language;
        
        // Om vi är på root och har sparat engelska, redirecta
        if (pathname === "/" && initialLang === "en") {
          setIsRedirecting(true);
          setLanguage("en");
          router.replace("/en");
        } else {
          setLanguage(initialLang);
          setIsInitialized(true);
        }
      } else if (navigator.language && navigator.language.startsWith("en")) {
        // Browser language är engelska och vi är på root
        if (pathname === "/") {
          setIsRedirecting(true);
          setLanguage("en");
          router.replace("/en");
        } else {
          setLanguage("en");
          setIsInitialized(true);
        }
      } else {
        setLanguage("sv");
        setIsInitialized(true);
      }
    }
  }, [pathname, isInitialized, router]);

  // Hantera när redirect är klar
  useEffect(() => {
    if (isRedirecting && pathname.startsWith("/en")) {
      setIsRedirecting(false);
      setIsInitialized(true);
    }
  }, [pathname, isRedirecting]);

  // Lyssna på pathname ändringar för navigation
  useEffect(() => {
    if (isInitialized && !isRedirecting) {
      const newLang = pathname.startsWith("/en") ? "en" : "sv";
      if (newLang !== language) {
        setLanguage(newLang);
      }
    }
  }, [pathname, language, isInitialized, isRedirecting]);

  const handleLanguageChange = (newLang: Language) => {
    if (newLang === language) return;

    // Spara i localStorage
    localStorage.setItem("lang", newLang);

    // Beräkna ny path
    let newPath = pathname;
    if (pathname.startsWith("/en") || pathname.startsWith("/sv")) {
      newPath = pathname.substring(3) || "/";
    }

    const finalPath = newLang === "sv" ? newPath : `/en${newPath}`;

    // Navigera till ny path
    router.push(finalPath);
  };

  const value = {
    language,
    setLanguage: handleLanguageChange,
    t: translations[language],
    isInitialized,
  };

  // Tillhandahåll alltid context, men med en loading-indikator
  return (
    <LanguageContext.Provider value={value}>
      {isInitialized ? children : (
        <div className="min-h-screen bg-black">
          {/* Minimal loading state som matchar din design */}
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}