"use client";

import React from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "../../../contexts/LanguageContext";
import SocialSidebar from "@/components/layout/SocialSidebar";
import { BookingButton } from "@/components/booking";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MenuPage() {
  const { t } = useLanguage();

  return (
    <main>
      <Header />

      {/* Hero Section with Background Image */}
      <section className="relative bg-black pb-16 pt-32 lg:pt-40 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/menu-bg.webp"
            alt="Restaurant background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black"></div>
        </div>

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
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  categoryIndex % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                {/* Menu Items List */}
                <div
                  className={`w-full ${
                    categoryIndex % 2 === 1 ? "lg:col-start-2" : ""
                  }`}
                >
                  <div className="mb-6 text-center">
                    <h2 className="mb-2 font-rustic uppercase text-3xl text-white">
                      {category.name}
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="pb-6">
                        <div className="flex items-baseline justify-between mb-3">
                          <h3 className="font-rustic text-xl text-white flex-shrink-0">
                            {item.name}
                          </h3>
                          <div className="flex-grow mx-4 border-b-2 border-dotted border-white/30 min-w-[20px]"></div>
                          <span className="font-rustic text-xl font-bold text-white flex-shrink-0">
                            {item.price} kr
                          </span>
                        </div>
                        <p className="mb-3 font-roboto leading-relaxed text-white/80">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Image */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`relative h-[50vh] w-full ${
                    categoryIndex % 2 === 1
                      ? "lg:col-start-1 lg:row-start-1"
                      : ""
                  }`}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="rounded-none object-cover"
                  />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking CTA */}
      <section className="bg-black py-16 text-white">
  <div className="container mx-auto px-4 lg:px-8 xl:px-12 text-center">
    <h2 className="mb-6 font-rustic uppercase text-4xl">
      {t.bookingSection.title}
    </h2>
    <p className="mx-auto mb-8 max-w-3xl font-roboto text-lg text-gray-300">
      {t.bookingSection.largeParty}
    </p>

    <Link href={`mailto:${t.bookingSection.email}`} passHref>
      <Button
        asChild
        variant="ghost"
        className="px-8 py-7 text-lg text-white"
      >
        <span className="flex items-center gap-2">
          <FaEnvelope className="mr-2 h-5 w-5" />
          {t.bookingSection.email}
        </span>
      </Button>
    </Link>
  </div>
</section>

      <Footer />
      <BookingButton />
      <SocialSidebar />
    </main>
  );
}
