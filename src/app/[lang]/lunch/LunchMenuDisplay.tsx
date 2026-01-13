"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaLeaf, FaCalendarWeek } from "react-icons/fa";
import type { Locale } from "../../../../i18n.config";

interface LunchItem {
  id: number;
  weekNumber: number;
  year: number;
  dayOfWeek: number;
  dishNameSv: string;
  dishNameEn: string;
  descriptionSv: string | null;
  descriptionEn: string | null;
  price: number;
  isVegetarian: boolean;
}

const WEEKDAYS_SV = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];
const WEEKDAYS_EN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function LunchMenuDisplay({ lang }: { lang: Locale }) {
  const [items, setItems] = useState<LunchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(0);

  useEffect(() => {
    const fetchLunch = async () => {
      try {
        const response = await fetch('/api/cms/lunch');
        if (response.ok) {
          const data = await response.json();
          setItems(data);
          if (data.length > 0) {
            setCurrentWeek(data[0].weekNumber);
          }
        }
      } catch (error) {
        console.error('Failed to load lunch menu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLunch();
  }, []);

  const weekdays = lang === 'sv' ? WEEKDAYS_SV : WEEKDAYS_EN;

  if (isLoading) {
    return (
      <section className="relative bg-black pb-16 pt-32 lg:pt-40 text-white min-h-screen">
        <div className="container mx-auto px-4 lg:px-8 xl:px-12">
          <div className="flex items-center justify-center py-24">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="relative bg-black pb-16 pt-32 lg:pt-40 text-white min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/lunch.webp"
            alt="Restaurant background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 lg:px-8 xl:px-12 text-center">
          <h1 className="mb-4 font-rustic uppercase text-5xl md:text-6xl drop-shadow-lg">
            {lang === 'sv' ? 'Lunchbuffé' : 'Lunch Menu'}
          </h1>
          <div className="max-w-2xl mx-auto mt-12">
            <p className="text-xl text-white/80 font-roboto">
              {lang === 'sv'
                ? 'Ingen lunchbuffé tillgänglig för närvarande. Kom tillbaka snart!'
                : 'No lunch buffet available at the moment. Check back soon!'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section with Background Image */}
      <section className="relative bg-black pb-16 pt-32 lg:pt-40 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/lunch.webp"
            alt="Restaurant background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 lg:px-8 xl:px-12 text-center">
          <h1 className="mb-4 font-rustic uppercase text-5xl md:text-6xl drop-shadow-lg">
            {lang === 'sv' ? 'Lunchbuffé' : 'Lunch Buffet'}
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <FaCalendarWeek className="h-5 w-5" />
            <p className="font-roboto text-lg">
              {lang === 'sv' ? `Vecka ${currentWeek}` : `Week ${currentWeek}`}
            </p>
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="bg-black pt-16 pb-16">
        <div className="container mx-auto px-4 lg:px-8 xl:px-12">
          <div className="max-w-5xl mx-auto">
            {Object.entries(
              items.reduce((acc, item) => {
                if (!acc[item.dayOfWeek]) acc[item.dayOfWeek] = [];
                acc[item.dayOfWeek].push(item);
                return acc;
              }, {} as Record<number, LunchItem[]>)
            )
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([day, dayItems], index) => {
                const dayPrice = dayItems[0]?.price || 0;
                const hasDifferentPrices = dayItems.some(item => item.price !== dayPrice);
                
                return (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="mb-12 last:mb-0"
                  >
                    {/* Elegant Day Card */}
                    <div className="bg-zinc-950 border-2 border-white/20 rounded overflow-hidden">
                      {/* Day Header */}
                      <div className="bg-white/5 border-b-2 border-white/20 px-8 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="font-rustic uppercase text-3xl md:text-4xl text-white tracking-wider mb-1">
                              {weekdays[parseInt(day)]}
                            </h2>
                          </div>
                          {!hasDifferentPrices && (
                            <div className="text-right">
                              <div className="text-sm uppercase tracking-widest text-white/60 font-roboto">
                                {lang === 'sv' ? 'Pris' : 'Price'}
                              </div>
                              <div className="font-rustic text-3xl md:text-4xl text-white">
                                {dayPrice} <span className="text-2xl text-white/80">kr</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dishes */}
                      <div className="px-8 py-6 space-y-6">
                        {dayItems.map((item, itemIndex) => (
                          <div 
                            key={item.id} 
                            className={`${itemIndex !== dayItems.length - 1 ? 'pb-6 border-b border-white/10' : ''}`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <h3 className="font-rustic text-xl md:text-2xl text-white">
                                    {lang === 'sv' ? item.dishNameSv : item.dishNameEn}
                                  </h3>
                                  {item.isVegetarian && (
                                    <span className="flex items-center gap-1.5 bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full text-xs font-roboto uppercase tracking-wide">
                                      <FaLeaf className="w-3 h-3" />
                                      <span>{lang === 'sv' ? 'Vegetarisk' : 'Vegetarian'}</span>
                                    </span>
                                  )}
                                </div>
                                {((lang === 'sv' && item.descriptionSv) || (lang === 'en' && item.descriptionEn)) && (
                                  <p className="font-roboto text-base leading-relaxed text-white/70 max-w-3xl mt-1">
                                    {lang === 'sv' ? item.descriptionSv : item.descriptionEn}
                                  </p>
                                )}
                              </div>
                              
                              {hasDifferentPrices && (
                                <div className="flex-shrink-0 text-right">
                                  <div className="font-rustic text-2xl md:text-3xl text-white">
                                    {item.price} <span className="text-xl text-white/80">kr</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>

          {/* Info Section */}
          <div className="mt-12 text-center max-w-3xl mx-auto">
            <div className="inline-block border-t border-b border-white/20 py-4 px-8">
              <p className="font-roboto text-base md:text-lg text-gray-300 leading-relaxed">
                {lang === 'sv'
                  ? 'Till lunchen ingår salladsbuffé, soppa, nybakt bröd, fika, måltidsdryck och kaffe. För vegetariskt alternativ, fråga köket.'
                  : 'Your lunch includes a salad buffet, soup, freshly baked bread, fika, meal drinks, and coffee. Please ask the kitchen about vegetarian options.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}