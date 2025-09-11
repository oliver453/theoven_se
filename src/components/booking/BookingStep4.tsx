"use client";

import React, { useState } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { CustomerInfo } from "../../../types/booking";

interface BookingStep4Props {
  onCustomerInfoSubmit: (customerInfo: CustomerInfo) => void;
  onPrev: () => void;
  isSubmitting: boolean;
}

export const BookingStep4: React.FC<BookingStep4Props> = ({
  onCustomerInfoSubmit,
  onPrev,
  isSubmitting,
}) => {
  const { t, language } = useLanguage();
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    locale: language === "en" ? "en_US" : "sv_SE",
    civility: "mr", // Detta är nu korrekt tipat som 'mr' | 'mrs' | 'miss'
    customerNote: "",
    optins: {
      restaurantNewsletter: false,
    },
  });

  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.email.trim()) {
      newErrors.email = t.booking?.step4?.validation?.emailRequired || "E-post är obligatorisk";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = t.booking?.step4?.validation?.emailInvalid || "Oggiltig e-postadress";
    }

    if (!customerInfo.firstName.trim()) {
      newErrors.firstName = t.booking?.step4?.validation?.firstNameRequired || "Förnamn är obligatoriskt";
    }

    if (!customerInfo.lastName.trim()) {
      newErrors.lastName = t.booking?.step4?.validation?.lastNameRequired || "Efternamn är obligatoriskt";
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = t.booking?.step4?.validation?.phoneRequired || "Telefonnummer är obligatoriskt";
    } else if (!/^\+?[\d\s-()]+$/.test(customerInfo.phone)) {
      newErrors.phone = t.booking?.step4?.validation?.phoneInvalid || "Ogiltigt telefonnummer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Update locale based on current language
      const updatedInfo = {
        ...customerInfo,
        locale: language === "en" ? "en_US" : "sv_SE"
      };
      onCustomerInfoSubmit(updatedInfo);
    }
  };

  const updateCustomerInfo = (field: keyof CustomerInfo, value: any) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // FIX: Typa civility-värden korrekt
  const handleCivilityChange = (value: string) => {
    // Type assertion för att säkerställa korrekt typ
    updateCustomerInfo("civility", value as "mr" | "mrs" | "miss");
  };

  const getCivilityOptions = () => {
    if (language === "en") {
      return [
        { value: "mr", label: "Mr" },
        { value: "mrs", label: "Mrs" },
        { value: "miss", label: "Ms" }
      ];
    } else {
      return [
        { value: "mr", label: "Herr" },
        { value: "mrs", label: "Fru" },
        { value: "miss", label: "Fröken" }
      ];
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h3 className="mb-2 text-xl font-semibold text-white">
          {t.booking?.step4?.title || "Dina uppgifter"}
        </h3>
        <p className="text-sm text-gray-300">
          {t.booking?.step4?.subtitle || "Fyll i dina kontaktuppgifter för bokningen"}
        </p>
      </div>

      <div className="space-y-4">
        {/* Name fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t.booking?.step4?.firstName || "Förnamn"} *
            </label>
            <input
              type="text"
              value={customerInfo.firstName}
              onChange={(e) => updateCustomerInfo("firstName", e.target.value)}
              className={`w-full rounded-lg bg-gray-800 border px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white ${
                errors.firstName ? "border-red-500" : "border-gray-600"
              }`}
              placeholder={t.booking?.step4?.firstNamePlaceholder || "Förnamn"}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t.booking?.step4?.lastName || "Efternamn"} *
            </label>
            <input
              type="text"
              value={customerInfo.lastName}
              onChange={(e) => updateCustomerInfo("lastName", e.target.value)}
              className={`w-full rounded-lg bg-gray-800 border px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white ${
                errors.lastName ? "border-red-500" : "border-gray-600"
              }`}
              placeholder={t.booking?.step4?.lastNamePlaceholder || "Efternamn"}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t.booking?.step4?.title || "Titel"}
          </label>
          <select
            value={customerInfo.civility}
            onChange={(e) => handleCivilityChange(e.target.value)}
            className="w-full rounded-lg bg-gray-800 border border-gray-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            {getCivilityOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t.booking?.step4?.email || "E-post"} *
          </label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => updateCustomerInfo("email", e.target.value)}
            className={`w-full rounded-lg bg-gray-800 border px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white ${
              errors.email ? "border-red-500" : "border-gray-600"
            }`}
            placeholder={t.booking?.step4?.emailPlaceholder || "din@email.se"}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t.booking?.step4?.phone || "Telefonnummer"} *
          </label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => updateCustomerInfo("phone", e.target.value)}
            className={`w-full rounded-lg bg-gray-800 border px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white ${
              errors.phone ? "border-red-500" : "border-gray-600"
            }`}
            placeholder={t.booking?.step4?.phonePlaceholder || "+46 70 123 45 67"}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
          )}
        </div>

        {/* Customer note */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t.booking?.step4?.customerNote || "Meddelande till restaurangen (frivilligt)"}
          </label>
          <textarea
            value={customerInfo.customerNote || ""}
            onChange={(e) => updateCustomerInfo("customerNote", e.target.value)}
            rows={3}
            className="w-full rounded-lg bg-gray-800 border border-gray-600 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder={t.booking?.step4?.customerNotePlaceholder || "Särskilda önskemål, allergier, etc..."}
          />
        </div>

        {/* Newsletter opt-in */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="newsletter"
            checked={customerInfo.optins.restaurantNewsletter}
            onChange={(e) =>
              updateCustomerInfo("optins", {
                restaurantNewsletter: e.target.checked,
              })
            }
            className="rounded border-gray-600 bg-gray-800 text-white focus:ring-white"
          />
          <label htmlFor="newsletter" className="text-sm text-gray-300">
            {t.booking?.step4?.newsletter || "Jag vill ta emot nyhetsbrev från restaurangen"}
          </label>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-gray-700 py-3 font-medium text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
        >
          {t.booking?.backButton || "Tillbaka"}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-white py-3 font-medium text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting 
            ? (t.booking?.step4?.submitting || "Bokar...") 
            : (t.booking?.step4?.submitButton || "Slutför bokning")
          }
        </button>
      </div>
    </form>
  );
};