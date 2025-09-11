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
  const [isInitialized, setIsInitialized] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
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
      } else if (savedLang && (savedLang === "sv" || savedLang === "en")) {
        initialLang = savedLang as Language;
      } else if (navigator.language && navigator.language.startsWith("en")) {
        initialLang = "en";
      }

      // Om vi är på root och ska ha engelska, markera för redirect
      if (pathname === "/" && initialLang === "en") {
        setShouldRedirect(true);
        setLanguage("en");
      } else {
        setLanguage(initialLang);
      }
      
      setIsInitialized(true);
    }
  }, [pathname, isInitialized]);

  // Hantera redirect efter att state är satt
  useEffect(() => {
    if (shouldRedirect && isInitialized) {
      router.replace("/en");
      setShouldRedirect(false);
    }
  }, [shouldRedirect, isInitialized, router]);

  // Lyssna på pathname ändringar för navigation
  useEffect(() => {
    if (isInitialized && !shouldRedirect) {
      const newLang = pathname.startsWith("/en") ? "en" : "sv";
      if (newLang !== language) {
        setLanguage(newLang);
      }
    }
  }, [pathname, language, isInitialized, shouldRedirect]);

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
  };

  // Visa loading eller null medan vi initialiserar för att förhindra flash
  if (!isInitialized || shouldRedirect) {
    return (
      <div style={{ opacity: 0, position: "absolute" }}>
        {children}
      </div>
    );
  }

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