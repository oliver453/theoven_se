"use client";

import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="kontakt" className="bg-black text-white">
      <div className="mx-auto w-full">
        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-12">
          {/* Karta */}
          <div className="h-60 md:h-72 w-full overflow-hidden md:h-96 md:px-0">
            <iframe
              src="https://maps.google.com/maps?q=The%20Oven%2C%20671%2031%20Arvika&amp;t=m&amp;z=15&amp;output=embed&amp;iwloc=near"
              title="The Oven, 671 31 Arvika"
              aria-label="The Oven, 671 31 Arvika"
              loading="lazy"
              className="h-full w-full border-0"
            />
          </div>

          {/* Kontaktinfo */}
          <div className="h-80 md:h-72 mx-auto flex flex-col justify-center space-y-6 px-6 py-10 text-center sm:px-8 md:h-96 md:px-10">
            <h3 className="font-rustic text-2xl font-bold uppercase tracking-wide">
              {t.footer.contactTitle}
            </h3>
            <ul className="space-y-2 font-roboto">
              <li>
                <a
                  href="tel:+4657010100"
                  className="flex items-center justify-center gap-2 hover:underline"
                >
                  <FaPhone className="h-4 w-4 scale-x-[-1] transform" />
                  <span>0570-10 100</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@theoven.se"
                  className="flex items-center justify-center gap-2 hover:underline"
                >
                  <FaEnvelope className="h-4 w-4" />{" "}
                  <span>hello@theoven.se</span>
                </a>
              </li>
              <li className="flex items-center justify-center gap-2">
                <FaMapMarkerAlt className="h-4 w-4" />{" "}
                <span>Kyrkogatan 20, 671 31 Arvika</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}