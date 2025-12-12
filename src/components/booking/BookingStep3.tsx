// src/components/booking/BookingStep3.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { FaChevronDown } from "react-icons/fa";
import { fetchTimeslots } from "../../utils/easyTableApi";
import type { EasyTableTimeslot } from "../../../types/booking";
import type { Locale } from "../../../i18n.config";

type Dictionary = {
  booking: {
    step3?: {
      title?: string;
      noTimes?: string;
    };
    backButton?: string;
    nextButton?: string;
  };
};

interface BookingStep3Props {
  partySize: number;
  selectedDate: string;
  selectedTime: number | null;
  onTimeSelect: (time: number, bookingTypeID?: number) => void;
  onNext: () => void;
  onPrev: () => void;
  dict: Dictionary;
  lang?: Locale;
}

// Memoized TimeSlot button
const TimeSlotButton = React.memo<{
  slot: EasyTableTimeslot;
  isSelected: boolean;
  onSelect: (time: number, bookingTypeID?: number) => void;
  formatTime: (minutes: number) => string;
}>(({ slot, isSelected, onSelect, formatTime }) => (
  <button
    onClick={() => onSelect(slot.time, slot.bookingTypeID)}
    className={`
      rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all duration-200
      ${
        isSelected
          ? "border-white bg-white text-black"
          : "border-gray-600 bg-gray-800 text-white hover:border-gray-400 hover:bg-gray-700"
      }
    `}
  >
    {formatTime(slot.time)}
  </button>
));
TimeSlotButton.displayName = 'TimeSlotButton';

export const BookingStep3: React.FC<BookingStep3Props> = ({
  partySize,
  selectedTime,
  selectedDate,
  onTimeSelect,
  onNext,
  onPrev,
  dict,
  lang = "sv",
}) => {
  const [timeslots, setTimeslots] = useState<EasyTableTimeslot[]>([]);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Memoized time formatter
  const formatTimeFromMinutes = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  }, []);

  // Memoized period name getter
  const getPeriodName = useCallback((hour: number) => {
    if (lang === "en") {
      if (hour < 12) return "Morning";
      else if (hour < 17) return "Lunch";
      else if (hour < 22) return "Dinner";
      else return "Evening";
    } else {
      if (hour < 12) return "Förmiddag";
      else if (hour < 17) return "Lunch";
      else if (hour < 22) return "Middag";
      else return "Kväll";
    }
  }, [lang]);

  // Memoized grouped timeslots
  const groupedTimeslots = useMemo(() => {
    return timeslots.reduce(
      (groups: Record<string, EasyTableTimeslot[]>, slot) => {
        const hour = Math.floor(slot.time / 60);
        const period = getPeriodName(hour);

        if (!groups[period]) groups[period] = [];
        groups[period].push(slot);
        return groups;
      },
      {},
    );
  }, [timeslots, getPeriodName]);

  // Memoized date formatter
  const formattedDate = useMemo(() => {
    const locale = lang === "en" ? "en-US" : "sv-SE";
    return new Date(selectedDate).toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }, [selectedDate, lang]);

  // Memoized person text
  const personText = useMemo(() => {
    if (lang === "en") {
      return partySize === 1 ? "person" : "people";
    } else {
      return partySize === 1 ? "person" : "personer";
    }
  }, [partySize, lang]);

  const loadTimeslots = useCallback(async () => {
    if (!selectedDate) return;
    
    setIsLoading(true);
    try {
      const data = await fetchTimeslots(selectedDate, partySize);
      setTimeslots(data);
    } catch (error) {
      console.error("Failed to load timeslots:", error);
      setTimeslots([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, partySize]);

  useEffect(() => {
    loadTimeslots();
  }, [loadTimeslots]);

  // Scroll indicator logic
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
      setShowScrollIndicator(!isAtBottom && scrollHeight > clientHeight);
    };

    handleScroll();

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [timeslots]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="mb-2 text-xl font-semibold text-white">
          {dict.booking?.step3?.title || "Vilken tid?"}
        </h3>
        <p className="text-sm text-gray-300">
          {formattedDate} • {partySize} {personText}
        </p>
      </div>

      {/* Time slots container */}
      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          </div>
        ) : Object.keys(groupedTimeslots).length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-400">
              {dict.booking?.step3?.noTimes || "Inga lediga tider för detta datum"}
            </p>
          </div>
        ) : (
          <>
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/10 via-transparent to-gray-900/30 rounded-xl pointer-events-none" />

            {/* Scrollable content */}
            <div
              ref={scrollContainerRef}
              className="relative max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
            >
              <div className="space-y-4 p-2">
                {Object.entries(groupedTimeslots).map(([period, slots]) => (
                  <div key={period}>
                    <h4 className="mb-3 text-sm font-medium text-gray-300 sticky top-0 bg-black/80 backdrop-blur-sm py-1 z-10">
                      {period}
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {slots.map((slot) => (
                        <TimeSlotButton
                          key={slot.time}
                          slot={slot}
                          isSelected={selectedTime === slot.time}
                          onSelect={onTimeSelect}
                          formatTime={formatTimeFromMinutes}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2 transform transition-all duration-500 ${
                showScrollIndicator
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }`}
            >
              <FaChevronDown className="text-gray-400 animate-bounce" size={14} />
            </div>
          </>
        )}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onPrev}
          className="flex-1 rounded-lg bg-gray-700 py-3 font-medium text-white transition-colors hover:bg-gray-600"
        >
          {dict.booking?.backButton || "Tillbaka"}
        </button>
        <button
          onClick={onNext}
          disabled={selectedTime === null}
          className="flex-1 rounded-lg bg-white py-3 font-medium text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {dict.booking?.nextButton || "Nästa"}
        </button>
      </div>
    </div>
  );
};