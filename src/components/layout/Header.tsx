"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useScroll from "@/lib/hooks/use-scroll";
import LanguageSwitcher from "../LanguageSwitcher";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function Header() {
  const scrolled = useScroll(50);
  const { t, language, isInitialized } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Visa inte headern förrän språket är initialiserat
  if (!isInitialized) {
    return null; // eller en enkel placeholder
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Funktion för att skapa korrekt länk baserat på språk
  const createLink = (path: string) => {
    if (language === "en") {
      // För engelska, lägg till /en prefix
      if (path.startsWith("/#")) {
        return `/en${path}`;
      } else if (path.startsWith("/")) {
        return `/en${path}`;
      }
      return `/en/${path}`;
    }
    // För svenska, använd original path
    return path;
  };

  // Navigationsobjekt med språkmedvetna länkar
  const navigationItems = [
    { href: createLink("/#om-oss"), label: t.nav.about },
    { href: createLink("/meny"), label: t.nav.menu },
    { href: createLink("/#stora"), label: t.nav.groups },
    { href: createLink("/#business-hours"), label: t.nav.hours },
    { href: createLink("#kontakt"), label: t.nav.contact },
  ];

  return (
    <>
      <header
        className={`
          fixed left-0 right-0 top-0 z-30 transition-all duration-200 ease-out
          ${scrolled ? "lg:bg-white bg-transparent" : "bg-transparent text-white"}
        `}
        role="banner"
      >
        <div
          className={`transition-all duration-200 ${
            scrolled ? "lg:bg-white lg:text-black bg-transparent text-white" : "bg-transparent"
          }`}
        >
          <div className="container mx-auto flex items-center justify-between px-4 lg:px-8 pt-4 lg:pt-0">
            <div
              className={`
              hidden transition-all duration-300 lg:block
              ${
                scrolled
                  ? "translate-x-0 py-4 opacity-100"
                  : "pointer-events-none -translate-x-4 py-8 opacity-0"
              }
            `}
            >
              <Link href={createLink("/")}>
                <Image
                  src="/the-oven.svg"
                  alt="The Oven Logo"
                  width={60}
                  height={40}
                  className="h-auto invert"
                />
              </Link>
            </div>

            <div className="w-full lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="flex h-8 w-8 flex-col items-center justify-center space-y-1 transition-all duration-300"
                aria-label="Toggle menu"
              >
                <Image
                  src="/hamburger.svg"
                  alt="Toggle menu"
                  width={60}
                  height={40}
                  className="h-auto invert"
                />
              </button>
            </div>

            <div
              className={`mx-auto hidden lg:flex ${
                scrolled ? "text-base" : "text-xl"
              } transition-all duration-200`}
            >
              <nav>
                <ul className="flex items-center space-x-8 font-rustic uppercase transition-colors">
                  {navigationItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="transition-opacity hover:opacity-70"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="mr-0">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-50" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMobileMenu}
      />

      <div
        className={`fixed left-0 right-0 top-0 z-50 bg-black transition-all duration-300 lg:hidden ${
          isMobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <div className="flex justify-start p-4">
          <button
            onClick={toggleMobileMenu}
            className="flex h-8 w-8 flex-col items-center justify-center transition-all duration-300"
            aria-label="Close menu"
          >
            <Image
              src="/close.svg"
              alt="Close menu"
              width={60}
              height={40}
              className="h-auto invert"
            />
          </button>
        </div>
        
        <nav className="container mx-auto px-8 py-8">
          <ul className="space-y-6">
            {navigationItems.map((item, index) => (
              <li
                key={index}
                className={`transform transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${index * 100 + 150}ms` : "0ms",
                }}
              >
                <Link
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="block text-xl font-rustic uppercase text-white transition-opacity hover:opacity-70"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}