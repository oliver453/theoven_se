"use client";

import React from "react";
import Image from "next/image";
import { Header, Footer } from "@/components/layout";;
import { useLanguage } from "../../../contexts/LanguageContext";
import SocialSidebar from "@/components/layout/SocialSidebar";
import { BookingButton } from "@/components/booking";

export default function MenuPage() {
  const { t } = useLanguage();

  return (
    <main>
      <Header />

      {/* Hero Section with Background Image */}
      <section className="relative bg-black pb-16 pt-32 lg:pt-40 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/menu-bg.webp" // Byt ut mot din bakgrundsbild
            alt="Restaurant background"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay - fadear från transparent till svart */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black"></div>
        </div>
        
        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 lg:px-8 xl:px-12 text-center">
          <h1 className="mb-4 font-rustic uppercase text-5xl md:text-6xl drop-shadow-lg">
            {t.menu.title}
          </h1>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="bg-black pt-16">
        <div className="container mx-auto px-4 lg:px-8 xl:px-12">
          {t.menu.categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-20">
              {/* Menu Category with Alternating Image Layout */}
              <div className={`grid grid-cols-1 lg:grid-cols-3 gap-12 ${
                categoryIndex % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                {/* Menu Items List - Takes up 2 columns */}
                <div className={`lg:col-span-2 ${
                  categoryIndex % 2 === 1 ? 'lg:col-start-2' : ''
                }`}>
                  {/* Category Title - Integrated with menu items */}
                  <div className="mb-6 text-center">
                    <h2 className="mb-2 font-rustic uppercase text-3xl text-white">
                      {category.name}
                    </h2>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-6">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="pb-6">
                        {/* Dish Name and Price with Dotted Line */}
                        <div className="flex items-baseline justify-between mb-3">
                          <h3 className="font-rustic text-xl text-white flex-shrink-0">
                            {item.name}
                          </h3>
                          <div className="flex-grow mx-4 border-b-2 border-dotted border-white/30 min-w-[20px]"></div>
                          <span className="font-rustic text-xl font-bold text-white flex-shrink-0">
                            {item.price} kr
                          </span>
                        </div>
                        
                        {/* Description */}
                        <p className="mb-3 font-roboto leading-relaxed text-white/80">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Image - Alternates between left and right */}
                <div className={`relative h-64 lg:h-96 ${
                  categoryIndex % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''
                }`}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="rounded-none object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking CTA */}
      <section className="bg-black py-16 text-white">
        <div className="container mx-auto px-4 lg:px-8 xl:px-12 text-center">
          <h2 className="mb-6 font-rustic uppercase text-4xl">{t.bookingSection.title}</h2>
          <p className="mx-auto mb-8 max-w-3xl font-roboto text-lg text-gray-300">
            {t.bookingSection.largeParty}
          </p>
          <a
            href={`mailto:${t.bookingSection.email}`}
            className="inline-block bg-white px-8 py-3 font-rustic uppercase text-lg text-black transition-colors hover:bg-orange-700"
          >
            {t.bookingSection.email}
          </a>
        </div>
      </section>

      <Footer />
      <BookingButton />
      <SocialSidebar />
    </main>
  );
}