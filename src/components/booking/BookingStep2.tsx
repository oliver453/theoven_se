"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { fetchAvailabilities } from "../../utils/theForkApi";
import {
  formatDateForAPI,
  getMonthName,
  getDaysInMonth,
} from "../../utils/dateHelpers";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { TheForkAvailability } from "../../../types/booking";

interface BookingStep2Props {
  partySize: number;
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const BookingStep2: React.FC<BookingStep2Props> = ({
  partySize,
  selectedDate,
  onDateSelect,
  onNext,
  onPrev,
}) => {
  const { t, language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availabilities, setAvailabilities] = useState<TheForkAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Weekday names based on language
  const weekdays = language === "en" 
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

  const loadAvailabilities = useCallback(async () => {
    setIsLoading(true);
    try {
      const startDate = formatDateForAPI(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
      );
      const endDate = formatDateForAPI(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0),
      );

      const data = await fetchAvailabilities(partySize, startDate, endDate);
      setAvailabilities(data);
    } catch (error) {
      console.error("Failed to load availabilities:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth, partySize]);

  useEffect(() => {
    loadAvailabilities();
  }, [loadAvailabilities]);

  const isDateAvailable = (date: Date): boolean => {
    const dateStr = formatDateForAPI(date);
    return availabilities.some(
      (avail) => avail.date === dateStr && avail.hasNormalStock,
    );
  };

  const isDateSelected = (date: Date): boolean => {
    return formatDateForAPI(date) === selectedDate;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const handleDateClick = (date: Date) => {
    if (isDateAvailable(date) && date >= new Date()) {
      onDateSelect(formatDateForAPI(date));
    }
  };

  const daysInMonth = getDaysInMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
  );
  const today = new Date();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="mb-2 text-xl font-semibold text-white">
          {t.booking?.step2?.title || "Vilken dag?"}
        </h3>
        <p className="text-sm text-gray-300">
          {t.booking?.step2?.subtitle || "Välj datum för din bokning"}
        </p>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-2 text-gray-400 transition-colors hover:text-white"
          disabled={isLoading}
        >
          <FaChevronLeft className="h-4 w-4" />
        </button>

        <h4 className="font-medium capitalize text-white">
          {/* FIX: Ändra från getMonthName(currentMonth, language) till bara getMonthName(currentMonth) */}
          {getMonthName(currentMonth)}
        </h4>

        <button
          onClick={() => navigateMonth("next")}
          className="p-2 text-gray-400 transition-colors hover:text-white"
          disabled={isLoading}
        >
          <FaChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {weekdays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-gray-400"
          >
            {day}
          </div>
        ))}

        {/* Empty cells for days before month start */}
        {Array.from({ length: (daysInMonth[0].getDay() + 6) % 7 }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Calendar days */}
        {daysInMonth.map((date) => {
          const available = isDateAvailable(date);
          const selected = isDateSelected(date);
          const isPast = date < today;
          const canSelect = available && !isPast;

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              disabled={!canSelect}
              className={`
                aspect-square rounded text-sm font-medium transition-all duration-200
                ${
                  selected
                    ? "bg-white text-black"
                    : canSelect
                    ? "border border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
                    : "cursor-not-allowed text-gray-500 opacity-50"
                }
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onPrev}
          className="flex-1 rounded-lg bg-gray-700 py-3 font-medium text-white transition-colors hover:bg-gray-600"
        >
          {t.booking?.backButton || "Tillbaka"}
        </button>
        <button
          onClick={onNext}
          disabled={!selectedDate}
          className="flex-1 rounded-lg bg-white py-3 font-medium text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t.booking?.nextButton || "Nästa"}
        </button>
      </div>
    </div>
  );
};