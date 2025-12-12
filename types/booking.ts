// types/booking.ts
export interface BookingFormData {
  partySize: number;
  date: string;
  time: number;
  customerInfo: CustomerInfo;
  options?: BookingOptions;
  bookingTypeID?: number; // Lägg till bookingTypeID
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  comment?: string;
}

export interface BookingOptions {
  highchair?: boolean;
  birthday?: boolean;
  wheelchair?: boolean;
}

export interface EasyTableAvailability {
  date: string;
  hasAvailability: boolean;
  times: Array<{
    time: string;
    available: number;
  }>;
}

export interface EasyTableTimeslot {
  time: number; // minutes from midnight
  datetime: string;
  bookingTypeID?: number;
}

export interface EasyTableBookingResponse {
  success: boolean;
  bookingID?: number;
  customerID?: number;
  paymentURL?: string;
  error?: string;
}