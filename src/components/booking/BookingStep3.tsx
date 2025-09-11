"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { fetchTimeslots } from "../../utils/theForkApi";
import { formatTimeFromMinutes } from "../../utils/dateHelpers";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { TheForkTimeslot } from "../../../types/booking";

interface BookingStep3Props {
  partySize: number;
  selectedDate: string;
  selectedTime: number | null;
  onTimeSelect: (time: number) => void;
  onBook: () => void;
  onPrev: () => void;
}

export const BookingStep3: React.FC<BookingStep3Props> = ({
  partySize,
  selectedTime,
  selectedDate,
  onTimeSelect,
  onBook,
  onPrev,
}) => {
  const { t, language } = useLanguage();
  const [timeslots, setTimeslots] = useState<TheForkTimeslot[]>([]);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadTimeslots = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchTimeslots(selectedDate, partySize);
      setTimeslots(data);
    } catch (error) {
      console.error("Failed to load timeslots:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, partySize]);

  useEffect(() => {
    if (selectedDate) {
      loadTimeslots();
    }
  }, [selectedDate, loadTimeslots]);

  // Lyssna på scrollposition och visa/dölj pilen
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
      setShowScrollIndicator(!isAtBottom && scrollHeight > clientHeight);
    };

    // Kör en gång direkt
    handleScroll();

    scrollContainer.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [timeslots]);

  // Time period names based on language
  const getPeriodName = (hour: number) => {
    if (language === "en") {
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
  };

  const groupedTimeslots = timeslots.reduce(
    (groups: Record<string, TheForkTimeslot[]>, slot) => {
      const hour = Math.floor(slot.time / 60);
      const period = getPeriodName(hour);

      if (!groups[period]) groups[period] = [];
      groups[period].push(slot);
      return groups;
    },
    {},
  );

  const formatDate = (dateString: string) => {
    const locale = language === "en" ? "en-US" : "sv-SE";
    return new Date(dateString).toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const getPersonText = (count: number) => {
    if (language === "en") {
      return count === 1 ? "person" : "people";
    } else {
      return count === 1 ? "person" : "personer";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="mb-2 text-xl font-semibold text-white">
          {t.booking?.step3?.title || "Vilken tid?"}
        </h3>
        <p className="text-sm text-gray-300">
          {formatDate(selectedDate)} • {partySize} {getPersonText(partySize)}
        </p>
      </div>

      {/* Time slots container with scroll indicators */}
      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          </div>
        ) : Object.keys(groupedTimeslots).length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-400">
              {t.booking?.step3?.noTimes || "Inga lediga tider för detta datum"}
            </p>
          </div>
        ) : (
          <>
            {/* Background gradient for scroll area */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/10 via-transparent to-gray-900/30 rounded-xl pointer-events-none" />

            {/* Scrollable content - increased height */}
            <div
              ref={scrollContainerRef}
              className="relative max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
            >
              <div className="space-y-4 p-2">
                {Object.entries(groupedTimeslots).map(([period, slots]) => (
                  <div key={period}>
                    <h4 className="mb-3 text-sm font-medium text-gray-300 sticky top-0 bg-black/80 backdrop-blur-sm py-1">
                      {period}
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => onTimeSelect(slot.time)}
                          className={`
                            rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all duration-200
                            ${
                              selectedTime === slot.time
                                ? "border-white bg-white text-black"
                                : "border-gray-600 bg-gray-800 text-white hover:border-gray-400 hover:bg-gray-700"
                            }
                          `}
                        >
                          {formatTimeFromMinutes(slot.time)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll indicator at bottom with smooth transition */}
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
          {t.booking?.backButton || "Tillbaka"}
        </button>
        <button
          onClick={onBook}
          disabled={selectedTime === null}
          className="flex-1 rounded-lg bg-white py-3 font-medium text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t.booking?.step3?.bookButton || "Boka bord"}
        </button>
      </div>
    </div>
  );
};
