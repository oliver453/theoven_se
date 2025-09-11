"use client";

import React from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { ContentBox } from "@/components/ContentBox";
import { motion } from "framer-motion";

const sectionBackgrounds = ["/images/4.webp", "/images/5.webp"];

export function InfoSections() {
  const { t } = useLanguage();

  const sections = [
    {
      key: "section1",
      id: "ugnen",
      background: sectionBackgrounds[0],
      hasButton: false,
      position: "right" as const,
    },
    {
      key: "section2",
      id: "stora",
      background: sectionBackgrounds[1],
      hasButton: true,
      buttonLink: "mailto:hello@theoven.se",
      position: "left" as const,
    },
  ];

  return (
    <>
      {sections.map((section) => {
        const sectionData = t.info[section.key as keyof typeof t.info];

        return (
          <section
            key={section.key}
            id={section.id}
            className="parallax flex h-screen items-center justify-center md:justify-start"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url(${section.background})`,
            }}
          >
            <div className="w-full px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <ContentBox
                  title={sectionData.title}
                  text={sectionData.text}
                  buttonText={
                    section.hasButton ? (sectionData as any).button : undefined
                  }
                  buttonLink={section.buttonLink}
                  position={section.position}
                  subheading={
                    section.id === "stora"
                      ? t.info.section2.subheading
                      : undefined
                  }
                />
              </motion.div>
            </div>
          </section>
        );
      })}
    </>
  );
}
