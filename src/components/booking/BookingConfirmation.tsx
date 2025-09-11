"use client";

import React from "react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useLanguage } from "../../../contexts/LanguageContext";

interface BookingConfirmationProps {
  success: boolean;
  reservationId?: string;
  error?: string;
  onClose: () => void;
  onStartOver: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  success,
  reservationId,
  error,
  onClose,
  onStartOver,
}) => {
  const { t } = useLanguage();

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
        
        <div>
          <h3 className="mb-2 text-xl font-semibold text-white">
            {t.booking?.confirmation?.success?.title || "Bokning bekräftad!"}
          </h3>
          <p className="text-gray-300">
            {t.booking?.confirmation?.success?.message || "Din bokning har genomförts framgångsrikt."}
          </p>
          {reservationId && (
            <p className="mt-2 text-sm text-gray-400">
              {t.booking?.confirmation?.success?.reservationNumber || "Bokningsnummer:"} {reservationId}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-300">
            {t.booking?.confirmation?.success?.emailNotice || "Du kommer att få en bekräftelse via e-post inom kort."}
          </p>
          
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-white py-3 font-medium text-black transition-colors hover:bg-gray-100"
          >
            {t.booking?.confirmation?.success?.closeButton || "Stäng"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <FaExclamationTriangle className="mx-auto h-16 w-16 text-red-500" />
      
      <div>
        <h3 className="mb-2 text-xl font-semibold text-white">
          {t.booking?.confirmation?.error?.title || "Något gick fel"}
        </h3>
        <p className="text-gray-300">
          {t.booking?.confirmation?.error?.message || "Vi kunde inte slutföra din bokning."}
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg bg-gray-700 py-3 font-medium text-white transition-colors hover:bg-gray-600"
        >
          {t.booking?.confirmation?.error?.closeButton || "Stäng"}
        </button>
        <button
          onClick={onStartOver}
          className="flex-1 rounded-lg bg-white py-3 font-medium text-black transition-colors hover:bg-gray-100"
        >
          {t.booking?.confirmation?.error?.tryAgainButton || "Försök igen"}
        </button>
      </div>
    </div>
  );
};