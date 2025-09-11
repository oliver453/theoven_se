"use client";

import React from "react";
import { useLanguage } from "../../../contexts/LanguageContext";

interface BookingStep1Props {
  selectedPartySize: number;
  onPartySizeSelect: (size: number) => void;
  onNext: () => void;
}

export const BookingStep1: React.FC<BookingStep1Props> = ({
  selectedPartySize,
  onPartySizeSelect,
  onNext,
}) => {
  const { t } = useLanguage();
  const partySizes = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          {t.booking?.step1?.title || "Hur många är ni?"}
        </h3>
        <p className="text-gray-300 text-sm">
          {t.booking?.step1?.subtitle || "Välj antal personer"}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {partySizes.map((size) => (
          <button
            key={size}
            onClick={() => onPartySizeSelect(size)}
            className={`
              aspect-square rounded-lg border-2 transition-all duration-200
              flex items-center justify-center text-lg font-semibold
              ${
                selectedPartySize === size
                  ? 'bg-white text-black border-white'
                  : 'bg-gray-800 text-white border-gray-600 hover:border-gray-400'
              }
            `}
          >
            {size}
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!selectedPartySize}
        className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t.booking?.nextButton || "Nästa"}
      </button>
    </div>
  );
};