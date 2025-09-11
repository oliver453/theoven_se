"use client";

import React, { useState, useCallback } from "react";
import { FaTimes } from "react-icons/fa";
import { BookingStep1 } from "./BookingStep1";
import { BookingStep2 } from "./BookingStep2";
import { BookingStep3 } from "./BookingStep3";
import { BookingStep4 } from "./BookingStep4";
import { BookingConfirmation } from "./BookingConfirmation";
import { createReservation, fetchTimeslots } from "../../utils/theForkApi";
import { formatTimeFromMinutes } from "../../utils/dateHelpers";
// FIX: Uppdaterad import-path för att matcha types-strukturen
import type { BookingFormData, CustomerInfo, TheForkTimeslot } from "../../../types/booking";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    partySize: 0,
    date: "",
    time: 0,
    offerUuid: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    success: boolean;
    reservationId?: string;
    error?: string;
  } | null>(null);

  const handlePartySizeSelect = useCallback((size: number) => {
    setBookingData((prev) => ({ ...prev, partySize: size }));
  }, []);

  const handleDateSelect = useCallback((date: string) => {
    setBookingData((prev) => ({ ...prev, date }));
  }, []);

  const handleTimeSelect = useCallback(async (time: number) => {
    setBookingData((prev) => ({ ...prev, time }));
    
    // Fetch the offer UUID for the selected timeslot
    try {
      const timeslots: TheForkTimeslot[] = await fetchTimeslots(bookingData.date, bookingData.partySize);
      const selectedSlot = timeslots.find(slot => slot.time === time);
      // Fix: Add null check for bestOffer
      if (selectedSlot?.bestOffer?.uuid) {
        setBookingData((prev) => ({ ...prev, offerUuid: selectedSlot.bestOffer!.uuid }));
      }
    } catch (error) {
      console.error("Failed to get offer UUID:", error);
    }
  }, [bookingData.date, bookingData.partySize]);

  // FIX: Ändra till void istället för Promise<void> och använd explicit CustomerInfo-typ
  const handleCustomerInfoSubmit = useCallback((customerInfo: CustomerInfo): void => {
    setIsSubmitting(true);
    
    // Hantera async-logiken inuti en IIFE
    (async () => {
      try {
        // Create meal datetime from date and time
        const mealDate = new Date(bookingData.date);
        const hours = Math.floor(bookingData.time / 60);
        const minutes = bookingData.time % 60;
        mealDate.setHours(hours, minutes, 0, 0);
        
        const result = await createReservation(
          mealDate.toISOString(),
          bookingData.partySize,
          bookingData.offerUuid || "",
          customerInfo
        );
        
        setBookingResult(result);
        setCurrentStep(5); // Show confirmation step
      } catch (error) {
        setBookingResult({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error occurred"
        });
        setCurrentStep(5);
      } finally {
        setIsSubmitting(false);
      }
    })();
  }, [bookingData]);

  const resetForm = () => {
    setBookingData({ partySize: 0, date: "", time: 0, offerUuid: "" });
    setCurrentStep(1);
    setBookingResult(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleStartOver = () => {
    resetForm();
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  if (!isOpen) return null;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BookingStep1
            selectedPartySize={bookingData.partySize}
            onPartySizeSelect={handlePartySizeSelect}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <BookingStep2
            partySize={bookingData.partySize}
            selectedDate={bookingData.date}
            onDateSelect={handleDateSelect}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <BookingStep3
            partySize={bookingData.partySize}
            selectedDate={bookingData.date}
            selectedTime={bookingData.time || null}
            onTimeSelect={handleTimeSelect}
            onBook={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <BookingStep4
            onCustomerInfoSubmit={handleCustomerInfoSubmit}
            onPrev={prevStep}
            isSubmitting={isSubmitting}
          />
        );
      case 5:
        return (
          <BookingConfirmation
            success={bookingResult?.success || false}
            reservationId={bookingResult?.reservationId}
            error={bookingResult?.error}
            onClose={handleClose}
            onStartOver={handleStartOver}
          />
        );
      default:
        return null;
    }
  };

  const showProgressDots = currentStep <= 4;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-black opacity-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-2 right-2 z-[100] transform rounded-t-2xl bg-black transition-all duration-300 ease-out md:left-auto md:w-[50vh]">
        <div className="max-h-[80vh] overflow-y-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            {showProgressDots && (
              <div className="flex space-x-2">
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
                  />
                ))}
              </div>
            )}
            {!showProgressDots && <div />}
            
            <button
              onClick={handleClose}
              className="text-gray-400 transition-colors hover:text-white"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>

          {renderStep()}
        </div>
      </div>
    </>
  );
};