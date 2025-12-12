// src/utils/easyTableApi.ts
import type { 
  EasyTableAvailability, 
  EasyTableTimeslot, 
  BookingFormData,
  EasyTableBookingResponse 
} from "../../types/booking";

const API_BASE_URL = "https://api.easytable.com";
const API_KEY = process.env.NEXT_PUBLIC_EASYTABLE_API_KEY || "";
const PLACE_TOKEN = process.env.NEXT_PUBLIC_EASYTABLE_PLACE_TOKEN || "";

// In-memory cache med automatisk rensning
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minut

// Rensa gamla cache-poster varje 2 minuter
if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    Array.from(cache.entries()).forEach(([key, value]) => {
      if (now - value.timestamp > CACHE_DURATION) {
        cache.delete(key);
      }
    });
  }, 120000);
}

const getCachedData = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key: string, data: any): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Helper: MM/DD/YYYY -> YYYY-MM-DD
const convertEasyTableDate = (easyTableDate: string): string => {
  const [month, day, year] = easyTableDate.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Helper: YYYY-MM-DD -> MM/DD/YYYY för query params
const convertToEasyTableDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-');
  return `${month}/${day}/${year}`;
};

// Helper: YYYY-MM-DD -> YYYY/MM/DD för booking API
const convertToBookingDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-');
  return `${year}/${month}/${day}`;
};

// Helper: Format tid som HH:MM
const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

// Helper: Skapa ISO DateTime för booking (YYYY-MM-DDTHH:MM:SS.sssZ)
const createBookingDateTime = (date: string, time: number): string => {
  const hours = Math.floor(time / 60);
  const mins = time % 60;
  // Skapa ISO 8601 format med timezone
  return `${date}T${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00.000Z`;
};

// Helper: Format telefonnummer (ta bort alla non-digits)
const formatPhoneNumber = (phone: string): number | undefined => {
  const cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return undefined;
  
  // Om det börjar med 0, ersätt med 46
  if (cleaned.startsWith('0')) {
    return parseInt('46' + cleaned.substring(1));
  }
  // Om det redan har landskod
  if (cleaned.startsWith('46')) {
    return parseInt(cleaned);
  }
  // Annars, lägg till 46
  return parseInt('46' + cleaned);
};

export const fetchAvailabilities = async (
  partySize: number,
  startDate: string,
  endDate: string,
): Promise<EasyTableAvailability[]> => {
  const cacheKey = `avail-${partySize}-${startDate}-${endDate}`;
  const cached = getCachedData<EasyTableAvailability[]>(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    startDate: convertToEasyTableDate(startDate),
    endDate: convertToEasyTableDate(endDate),
    persons: partySize.toString(),
  });

  const response = await fetch(
    `${API_BASE_URL}/v2/availability/period?${params}`,
    {
      headers: {
        "X-Api-Key": API_KEY,
        "X-Place-Token": PLACE_TOKEN,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch availabilities: ${response.statusText}`);
  }

  const data = await response.json();
  
  const result = data.availability?.map((day: any) => ({
    date: convertEasyTableDate(day.date),
    hasAvailability: day.times?.some((t: any) => t.available > 0) || false,
    times: day.times || [],
  })) || [];

  setCachedData(cacheKey, result);
  return result;
};

export const fetchTimeslots = async (
  date: string,
  partySize: number,
): Promise<EasyTableTimeslot[]> => {
  const cacheKey = `slots-${date}-${partySize}`;
  const cached = getCachedData<EasyTableTimeslot[]>(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    date: convertToEasyTableDate(date),
    persons: partySize.toString(),
    distinct: "1",
  });

  const response = await fetch(
    `${API_BASE_URL}/v2/availability?${params}`,
    {
      headers: {
        "X-Api-Key": API_KEY,
        "X-Place-Token": PLACE_TOKEN,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch timeslots: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.dayStatus || !data.onlineBooking) {
    return [];
  }

  const result = data.availabilityTimes?.map((slot: any) => {
    const [hours, minutes] = slot.time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    
    return {
      time: timeInMinutes,
      datetime: `${date}T${slot.time}:00`,
      bookingTypeID: slot.bookingType?.id,
    };
  }) || [];

  setCachedData(cacheKey, result);
  return result;
};

export const createBooking = async (
  bookingData: BookingFormData
): Promise<EasyTableBookingResponse> => {
  const { date, time, partySize, customerInfo, options } = bookingData;
  
  // Bygg kommentar från tillval
  // OBS: Barnstol, rullstol och födelsedag läggs i kommentarer
  // eftersom de inte är tags i API:t (tags måste konfigureras i admin)
  const optionTexts: string[] = [];
  if (options?.highchair) optionTexts.push("Barnstol");
  if (options?.birthday) optionTexts.push("Födelsedag");
  if (options?.wheelchair) optionTexts.push("Rullstol");
  
  const comment = [
    customerInfo.comment,
    optionTexts.length > 0 ? `Tillval: ${optionTexts.join(', ')}` : ''
  ].filter(Boolean).join('\r\n');

  const bookingTypeID = bookingData.bookingTypeID;
  const isoDateTime = createBookingDateTime(date, time);

  // Bygg request body enligt API dokumentation
  const requestBody: any = {
    date: isoDateTime, // ISO 8601: "2025-12-13T15:15:00.000Z"
    time: formatTime(time), // HH:MM: "15:15"
    persons: partySize,
    name: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
    email: customerInfo.email,
    autoTable: true,
    emailNotifications: 1,
    onlineBooking: 1,
  };

  // Lägg till optional fält endast om de finns
  const mobile = formatPhoneNumber(customerInfo.phone);
  if (mobile) {
    requestBody.mobile = mobile;
  }

  if (customerInfo.company) {
    requestBody.company = customerInfo.company;
  }

  if (comment) {
    requestBody.comment = comment;
  }

  if (bookingTypeID) {
    requestBody.typeID = bookingTypeID; // API använder "typeID"
  }

  // Tags kan läggas till här om du har tag IDs
  // requestBody.tags = [tagID1, tagID2];

  console.log('Booking request:', requestBody); // Debug

  const response = await fetch(`${API_BASE_URL}/v2/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": API_KEY,
      "X-Place-Token": PLACE_TOKEN,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Booking error:', errorData); // Debug
    throw new Error(
      errorData.message || `Booking failed: ${response.statusText}`
    );
  }

  const data = await response.json();
  
  // Rensa relaterad cache efter lyckad bokning
  cache.delete(`slots-${date}-${partySize}`);
  cache.delete(`avail-${partySize}-${date}-${date}`);
  
  return {
    success: true,
    bookingID: data.bookingID,
    customerID: data.customerID,
    paymentURL: data.paymentURL,
  };
};