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
  const pathname = usePathname();
  const router = useRouter();

  // Lyssna på pathname ändringar och uppdatera språk
  useEffect(() => {
    const newLang = pathname.startsWith("/en") ? "en" : "sv";
    if (newLang !== language) {
      setLanguage(newLang);
    }
  }, [pathname, language]);

  // Initial språkinställning
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("lang");
      let initialLang: Language = "sv";

      if (pathname.startsWith("/en")) {
        initialLang = "en";
      } else if (savedLang && (savedLang === "sv" || savedLang === "en")) {
        initialLang = savedLang as Language;
      } else if (navigator.language && navigator.language.startsWith("en")) {
        initialLang = "en";
      }

      // Endast redirect om vi är på root och språket är engelska
      if (pathname === "/" && initialLang === "en") {
        router.replace("/en");
      } else if (initialLang !== language) {
        setLanguage(initialLang);
      }
    }
  }, []); // Kör bara en gång vid mount

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
    
    // Navigera till ny path (detta kommer trigga useEffect ovan)
    router.push(finalPath);
  };

  const value = {
    language,
    setLanguage: handleLanguageChange,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
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