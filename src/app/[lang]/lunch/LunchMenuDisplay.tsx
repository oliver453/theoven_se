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
            {lang === 'sv' ? 'Lunchmeny' : 'Lunch Menu'}
          </h1>
          <div className="max-w-2xl mx-auto mt-12">
            <p className="text-xl text-white/80 font-roboto">
              {lang === 'sv'
                ? 'Ingen lunchmeny tillgänglig för närvarande. Kom tillbaka snart!'
                : 'No lunch menu available at the moment. Check back soon!'}
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
            {lang === 'sv' ? 'Lunchmeny' : 'Lunch Menu'}
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
          {Object.entries(
            items.reduce((acc, item) => {
              if (!acc[item.dayOfWeek]) acc[item.dayOfWeek] = [];
              acc[item.dayOfWeek].push(item);
              return acc;
            }, {} as Record<number, LunchItem[]>)
          )
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([day, dayItems]) => (
              <div key={day} className="mb-20">
                {/* Day Header */}
                <div className="mb-6 text-center">
                  <h2 className="mb-2 font-rustic uppercase text-3xl text-white">
                    {weekdays[parseInt(day)]}
                  </h2>
                </div>

                {/* Dishes for this day */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="space-y-6 max-w-4xl mx-auto"
                >
                  {dayItems.map((item) => (
                    <div key={item.id} className="pb-6">
                      <div className="flex items-baseline justify-between mb-3">
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <h3 className="font-rustic text-xl text-white">
                            {lang === 'sv' ? item.dishNameSv : item.dishNameEn}
                          </h3>
                          {item.isVegetarian && (
                            <span className="flex items-center gap-1 text-green-400 text-xs">
                              <FaLeaf className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <div className="flex-grow mx-4 border-b-2 border-dotted border-white/30 min-w-[20px]"></div>
                        <span className="font-rustic text-xl font-bold text-white flex-shrink-0">
                          {item.price} kr
                        </span>
                      </div>
                      {((lang === 'sv' && item.descriptionSv) || (lang === 'en' && item.descriptionEn)) && (
                        <p className="mb-3 font-roboto leading-relaxed text-white/80">
                          {lang === 'sv' ? item.descriptionSv : item.descriptionEn}
                        </p>
                      )}
                    </div>
                  ))}
                </motion.div>
              </div>
            ))}

          {/* Info Section */}
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <p className="font-roboto text-lg text-gray-300">
              {lang === 'sv'
                ? 'Till lunchen ingår salladsbuffé, soppa, nybakt bröd, fika, måltidsdryck och kaffe.'
                : 'Your lunch includes a salad buffet, soup, freshly baked bread, fika, meal drinks, and coffee.'}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}