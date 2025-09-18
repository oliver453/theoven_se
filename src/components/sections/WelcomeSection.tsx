"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../../../contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import Slideshow from "../ui/slideshow";

const heroImages = [
  {
    src: "/images/1.webp",
    alt: "Färgglada drinkar serverade i glas med is och garnering",
  },
  {
    src: "/images/2.webp",
    alt: "Smashburgare med smält ost, sallad och tomat på briochebröd",
  },
  {
    src: "/images/12.webp",
    alt: "Haitham serverar vin",
  },
];

export function WelcomeSection() {
  const { t, language } = useLanguage();

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

  return (
    <section id="om-oss" className="relative flex min-h-screen items-center justify-center bg-black">
      {/* Content */}
      <div className="relative z-10 mx-auto h-full max-w-7xl px-6">
        <div className="grid min-h-screen items-center gap-12 py-20 lg:grid-cols-2">
          {/* Image slideshow med 4:5 aspect ratio - visas först på mobil */}
          <div className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
            <Slideshow
              images={heroImages}
              autoPlay={true}
              autoPlayInterval={6000}
              className="w-full"
            />
          </div>
          
          <div className="order-2 space-y-6 text-center text-white lg:order-1">
            <h4 className="hidden font-rustic uppercase tracking-wider lg:block">
              {t.welcome.subheading}
            </h4>
            <h1 className="mb-4 font-rustic text-3xl uppercase text-white">
              {t.welcome.title}
            </h1>
            <p className="text-md mx-auto max-w-lg leading-relaxed text-white/80 lg:mx-0">
              {t.welcome.text}
            </p>
            <Link href={createLink("/meny")} className="block">
  <Button className="bg-white hover:bg-gray-200 px-8 py-7 font-rustic text-lg uppercase text-black">
    {t.welcome.button}
  </Button>
</Link>
          </div>
        </div>
      </div>
    </section>
  );
}