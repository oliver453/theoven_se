"use client";

import React, { useState } from "react";
import { BookingModal } from "./BookingModal";
import { useLanguage } from "../../../contexts/LanguageContext";

export function BookingButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="fixed bottom-4 right-4 z-10">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center rounded-full bg-white
            px-6 py-4 text-base
            sm:px-6 sm:py-4 sm:text-lg
            font-medium uppercase text-black
            shadow-lg transition-all duration-300
            hover:scale-105 hover:opacity-90 hover:shadow-xl
          "
          aria-label={t.bookingBtn?.buttonAriaLabel || "Boka bord"}
        >
          <span>{t.bookingBtn?.buttonText || "Boka bord"}</span>
        </button>
      </div>
    </>
  );
}
