// src/components/booking/BookingStep4.tsx
"use client";

import React, { useState } from "react";
import type { CustomerInfo, BookingOptions } from "../../../types/booking";
import type { Locale } from "../../../i18n.config";

type Dictionary = {
  booking: {
    step4?: {
      title?: string;
      subtitle?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      company?: string;
      comment?: string;
      options?: {
        title?: string;
        highchair?: string;
        birthday?: string;
        wheelchair?: string;
      };
      bookButton?: string;
      requiredField?: string;
    };
    backButton?: string;
  };
};

interface BookingStep4Props {
  partySize: number;
  selectedDate: string;
  selectedTime: number;
  onBook: (customerInfo: CustomerInfo, options: BookingOptions) => void;
  onPrev: () => void;
  dict: Dictionary;
  lang?: Locale;
  isLoading?: boolean;
}

export const BookingStep4: React.FC<BookingStep4Props> = ({
  partySize,
  selectedDate,
  selectedTime,
  onBook,
  onPrev,
  dict,
  lang = "sv",
  isLoading = false,
}) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    comment: "",
  });

  const [options, setOptions] = useState<BookingOptions>({
    highchair: false,
    birthday: false,
    wheelchair: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});

  const formatDate = (dateString: string) => {
    const locale = lang === "en" ? "en-US" : "sv-SE";
    return new Date(dateString).toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  const getPersonText = (count: number) => {
    if (lang === "en") {
      return count === 1 ? "person" : "people";
    } else {
      return count === 1 ? "person" : "personer";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};
    const requiredText = dict.booking?.step4?.requiredField || "Obligatoriskt fält";

    if (!customerInfo.firstName.trim()) {
      newErrors.firstName = requiredText;
    }
    if (!customerInfo.lastName.trim()) {
      newErrors.lastName = requiredText;
    }
    if (!customerInfo.email.trim()) {
      newErrors.email = requiredText;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = lang === "en" ? "Invalid email" : "Ogiltig e-post";
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = requiredText;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onBook(customerInfo, options);
    }
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleOptionChange = (option: keyof BookingOptions) => {
    setOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="mb-2 text-xl font-semibold text-white">
          {dict.booking?.step4?.title || "Dina uppgifter"}
        </h3>
        <p className="text-sm text-gray-300">
          {formatDate(selectedDate)} • {formatTime(selectedTime)} • {partySize}{" "}
          {getPersonText(partySize)}
        </p>
      </div>

      <div className="space-y-4">
        {/* First Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">
            {dict.booking?.step4?.firstName || "Förnamn"} *
          </label>
          <input
            type="text"
            value={customerInfo.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className={`w-full rounded-lg border-2 bg-gray-800 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:outline-none ${
              errors.firstName
                ? "border-red-500 focus:border-red-400"
                : "border-gray-600 focus:border-gray-400"
            }`}
            placeholder={dict.booking?.step4?.firstName || "Förnamn"}
            disabled={isLoading}
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">
            {dict.booking?.step4?.lastName || "Efternamn"} *
          </label>
          <input
            type="text"
            value={customerInfo.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className={`w-full rounded-lg border-2 bg-gray-800 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:outline-none ${
              errors.lastName
                ? "border-red-500 focus:border-red-400"
                : "border-gray-600 focus:border-gray-400"
            }`}
            placeholder={dict.booking?.step4?.lastName || "Efternamn"}
            disabled={isLoading}
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">
            {dict.booking?.step4?.email || "E-post"} *
          </label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full rounded-lg border-2 bg-gray-800 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:outline-none ${
              errors.email
                ? "border-red-500 focus:border-red-400"
                : "border-gray-600 focus:border-gray-400"
            }`}
            placeholder="exempel@email.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">
            {dict.booking?.step4?.phone || "Mobilnummer"} *
          </label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className={`w-full rounded-lg border-2 bg-gray-800 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:outline-none ${
              errors.phone
                ? "border-red-500 focus:border-red-400"
                : "border-gray-600 focus:border-gray-400"
            }`}
            placeholder="+46 70 123 45 67"
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
          )}
        </div>

        {/* Company (Optional) */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">
            {dict.booking?.step4?.company || "Företag"}
          </label>
          <input
            type="text"
            value={customerInfo.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            className="w-full rounded-lg border-2 border-gray-600 bg-gray-800 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-gray-400 focus:outline-none"
            placeholder={dict.booking?.step4?.company || "Företag"}
            disabled={isLoading}
          />
        </div>

        {/* Comment (Optional) */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">
            {dict.booking?.step4?.comment || "Kommentar"}
          </label>
          <textarea
            value={customerInfo.comment}
            onChange={(e) => handleInputChange("comment", e.target.value)}
            rows={3}
            className="w-full rounded-lg border-2 border-gray-600 bg-gray-800 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-gray-400 focus:outline-none resize-none"
            placeholder={dict.booking?.step4?.comment || "Kommentar"}
            disabled={isLoading}
          />
        </div>

        {/* Options */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {dict.booking?.step4?.options?.title || "Tillval"}
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.highchair}
                onChange={() => handleOptionChange("highchair")}
                className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-white focus:ring-offset-0 focus:ring-offset-gray-900"
                disabled={isLoading}
              />
              <span className="text-gray-300">
                {dict.booking?.step4?.options?.highchair || "Barnstol"}
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.birthday}
                onChange={() => handleOptionChange("birthday")}
                className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-white focus:ring-offset-0 focus:ring-offset-gray-900"
                disabled={isLoading}
              />
              <span className="text-gray-300">
                {dict.booking?.step4?.options?.birthday || "Födelsedag"}
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.wheelchair}
                onChange={() => handleOptionChange("wheelchair")}
                className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-white focus:ring-offset-0 focus:ring-offset-gray-900"
                disabled={isLoading}
              />
              <span className="text-gray-300">
                {dict.booking?.step4?.options?.wheelchair || "Rullstol"}
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onPrev}
          disabled={isLoading}
          className="flex-1 rounded-lg bg-gray-700 py-3 font-medium text-white transition-colors hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {dict.booking?.backButton || "Tillbaka"}
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 rounded-lg bg-white py-3 font-medium text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
          ) : (
            dict.booking?.step4?.bookButton || "Slutför bokning"
          )}
        </button>
      </div>
    </div>
  );
};