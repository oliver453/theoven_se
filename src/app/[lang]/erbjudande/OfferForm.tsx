// src/app/[lang]/erbjudande/OfferForm.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { Locale } from "../../../../i18n.config";

interface OfferFormProps {
  dict: any;
  lang: Locale;
}

export default function OfferForm({ dict, lang }: OfferFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const t = dict.offer.form;

  const validateSwedishPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s-]/g, '');
    const regex = /^(\+46|0046|0)[1-9]\d{8,9}$/;
    return regex.test(cleaned);
  };

  const normalizePhone = (phone: string): string => {
    let cleaned = phone.replace(/[\s-]/g, '');
    
    if (cleaned.startsWith('+46')) {
      cleaned = '0' + cleaned.substring(3);
    } else if (cleaned.startsWith('0046')) {
      cleaned = '0' + cleaned.substring(4);
    }
    
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateSwedishPhone(phoneNumber)) {
      setError(t.invalidPhone);
      return;
    }

    if (!consent) {
      setError(t.consentRequired);
      return;
    }

    setIsLoading(true);

    try {
      const normalized = normalizePhone(phoneNumber);
      const response = await fetch('/api/offer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: normalized }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/${lang}/erbjudande/bekraftelse?code=${data.code}`);
      } else {
        if (response.status === 409) {
          setError(t.alreadyRegistered);
        } else {
          setError(data.error || t.error);
        }
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="content-box max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="phone" className="block font-rustic uppercase text-white mb-3">
            {t.phoneLabel}
          </label>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder={t.phonePlaceholder}
            className="w-full px-4 py-4 bg-black text-white border-2 border-white/20 rounded-none focus:outline-none focus:border-white transition-colors font-roboto"
            disabled={isLoading}
            required
          />
        </div>

        <div className="flex items-start gap-2">
          <input
            id="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-white/20 bg-black text-white focus:ring-white focus:ring-offset-black cursor-pointer"
            disabled={isLoading}
          />
          <label htmlFor="consent" className="font-roboto text-white/80 leading-relaxed cursor-pointer">
            {t.consentLabel}
          </label>
        </div>

        {error && (
          <div className="bg-red-500/10 border-2 border-red-500/50 rounded-none p-4">
            <p className="font-roboto text-red-300">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !consent}
          className="w-full bg-white text-black hover:bg-white/90 py-7 text-lg font-rustic uppercase rounded-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? t.submitting : t.submitButton}
        </Button>
      </form>
    </div>
  );
}