"use client";

import React from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const { t } = useLanguage();

  return (
    <section className="flex items-center justify-center bg-black px-8 py-12">
      <div className="mx-auto w-full lg:px-64">
        <h2 className="mb-8 text-center font-rustic text-4xl uppercase text-white">
          {t.faq.title}
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {t.faq.questions.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-roboto font-semibold text-white">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="font-roboto leading-relaxed text-white/80">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
