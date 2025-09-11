"use client";
import React from "react";
import { useLanguage } from "../../../contexts/LanguageContext";

const openingHours = {
  monday: "closed",
  tuesday: "16:00 - 21:00",
  wednesday: "16:00 - 21:00",
  thursday: "16:00 - 21:00",
  friday: "12:00 - 23:00",
  saturday: "12:00 - 23:00",
  sunday: "closed",
};

export function HoursSection() {
  const { t } = useLanguage();

  const getCurrentDay = () => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[new Date().getDay()];
  };

  const currentDay = getCurrentDay();

  const dayKeys = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ] as const;

  return (
    <section 
      id="business-hours" 
      className="parallax flex h-screen items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url(/images/1.webp)`,
      }}
    >
      <div className="content-box bg-white/95 backdrop-blur-sm max-w-lg text-center px-6 w-full mx-4 md:mx-auto lg:mr-24">
        <h2 className="mb-8 text-center font-rustic text-4xl uppercase text-white">
          {t.hours.title}
        </h2>

        <div className="divide-y divide-white/20">
          {dayKeys.map((day) => {
            const isToday = day === currentDay;
            const hours = openingHours[day];

            return (
              <div
                key={day}
                className={`flex items-center justify-between px-4 py-3 ${
                  isToday ? "bg-white/10" : ""
                }`}
              >
                <span
                  className={`font-rustic text-lg uppercase ${
                    isToday ? "text-white font-bold" : "text-white/80"
                  }`}
                >
                  {t.hours[day]}
                </span>
                <span
                  className={`font-roboto ${
                    isToday ? "text-white font-semibold" : "text-white/80"
                  }`}
                >
                  {hours === "closed" ? t.hours.closed : hours}
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm text-white/80 font-roboto">
          {t.hours.disclamer}
        </p>
      </div>
    </section>
  );
}