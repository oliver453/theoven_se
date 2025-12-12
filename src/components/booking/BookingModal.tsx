// src/components/booking/BookingModal.tsx
"use client";

import React, { useState, useCallback, useMemo } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { BookingStep1 } from "./BookingStep1";
import { BookingStep2 } from "./BookingStep2";
import { BookingStep3 } from "./BookingStep3";
import { BookingStep4 } from "./BookingStep4";
import { createBooking } from "../../utils/easyTableApi";
import type { BookingFormData, CustomerInfo, BookingOptions } from "../../../types/booking";
import type { Locale } from "../../../i18n.config";

type Dictionary = {
  bookingBtn: {
    buttonText: string;
    buttonAriaLabel: string;
  };
  booking: any;
};

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  dict: Dictionary;
  lang?: Locale;
}

const INITIAL_BOOKING_DATA: Partial<BookingFormData> = {
  partySize: 0,
  date: "",
  time: 0,
};

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  dict,
  lang = "sv",
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState<Partial<BookingFormData>>(INITIAL_BOOKING_DATA);

  const handlePartySizeSelect = useCallback((size: number) => {
    setBookingData((prev) => ({ ...prev, partySize: size }));
  }, []);

  const handleDateSelect = useCallback((date: string) => {
    setBookingData((prev) => ({ ...prev, date }));
  }, []);

  const handleTimeSelect = useCallback((time: number, bookingTypeID?: number) => {
    setBookingData((prev) => ({ ...prev, time, bookingTypeID }));
  }, []);

  const handleFinalBooking = useCallback(async (
    customerInfo: CustomerInfo,
    options: BookingOptions
  ) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const completeBookingData: BookingFormData = {
        partySize: bookingData.partySize!,
        date: bookingData.date!,
        time: bookingData.time!,
        bookingTypeID: bookingData.bookingTypeID,
        customerInfo,
        options,
      };

      const response = await createBooking(completeBookingData);

      if (response.success) {
        // Visa success toast
        const successTitle = lang === 'en' 
          ? 'Booking confirmed!' 
          : 'Bokning bekräftad!';
        const successMessage = lang === 'en'
          ? 'You will receive a confirmation email shortly.'
          : 'Du får en bekräftelse via e-post inom kort.';
        
        toast.success(successTitle, {
          description: successMessage,
        });
        
        // Stäng modal efter kort delay
        setTimeout(() => {
          onClose();
          setBookingData(INITIAL_BOOKING_DATA);
          setCurrentStep(1);
        }, 1500);
      } else {
        throw new Error(response.error || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      
      // Visa error toast
      const errorTitle = lang === 'en' 
        ? 'Booking failed' 
        : 'Bokningen misslyckades';
      const errorMessage = lang === 'en'
        ? 'An error occurred. Please try again or contact the restaurant directly.'
        : 'Ett fel uppstod. Vänligen försök igen eller kontakta restaurangen direkt.';
      
      toast.error(errorTitle, {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [bookingData, lang, onClose, isSubmitting]);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose();
      setTimeout(() => {
        setBookingData(INITIAL_BOOKING_DATA);
        setCurrentStep(1);
      }, 300);
    }
  }, [isSubmitting, onClose]);

  const nextStep = useCallback(() => setCurrentStep((prev) => Math.min(prev + 1, 4)), []);
  const prevStep = useCallback(() => setCurrentStep((prev) => Math.max(prev - 1, 1)), []);

  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return (
          <BookingStep1
            selectedPartySize={bookingData.partySize || 0}
            onPartySizeSelect={handlePartySizeSelect}
            onNext={nextStep}
            dict={dict}
          />
        );
      case 2:
        return (
          <BookingStep2
            partySize={bookingData.partySize || 0}
            selectedDate={bookingData.date || ""}
            onDateSelect={handleDateSelect}
            onNext={nextStep}
            onPrev={prevStep}
            dict={dict}
            lang={lang}
          />
        );
      case 3:
        return (
          <BookingStep3
            partySize={bookingData.partySize || 0}
            selectedDate={bookingData.date || ""}
            selectedTime={bookingData.time || null}
            onTimeSelect={handleTimeSelect}
            onNext={nextStep}
            onPrev={prevStep}
            dict={dict}
            lang={lang}
          />
        );
      case 4:
        return (
          <BookingStep4
            partySize={bookingData.partySize || 0}
            selectedDate={bookingData.date || ""}
            selectedTime={bookingData.time || 0}
            onBook={handleFinalBooking}
            onPrev={prevStep}
            dict={dict}
            lang={lang}
            isLoading={isSubmitting}
          />
        );
      default:
        return null;
    }
  }, [currentStep, bookingData, handlePartySizeSelect, handleDateSelect, handleTimeSelect, 
      handleFinalBooking, nextStep, prevStep, dict, lang, isSubmitting]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 z-[80]"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div 
        className="fixed bottom-0 left-2 right-2 z-[100] transform rounded-t-2xl bg-black transition-all duration-300 ease-out md:left-auto md:w-[50vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        <div className="max-h-[80vh] overflow-y-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            {/* Progress indicators */}
            <div className="flex space-x-2" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={4}>
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    step === currentStep
                      ? "bg-white"
                      : step < currentStep
                      ? "bg-gray-400"
                      : "bg-gray-600"
                  }`}
                  aria-label={`Steg ${step}${step === currentStep ? ' (aktiv)' : ''}`}
                />
              ))}
            </div>
            
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 transition-colors hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Stäng bokningsformulär"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>

          {stepContent}
        </div>
      </div>
    </>
  );
};