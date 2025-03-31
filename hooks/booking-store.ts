import { create } from "zustand";
import { createBooking as createBookingAction } from "@/lib/actions/booking.action"; // assume this function is defined in your actions

// Define the type for dogs data
export type DogsData = {
  dogName: string;
  dogId: string;
  roomName: string | null;
  roomId: string | null;
}[];

// Define a type for client information
export interface ClientData {
  clientId: string;
  clientName: string;
  phone: string;
  location: string;
  transportFee: number;
  bookingFee: number;
  // add additional fields if necessary
}

export interface BookingStoreState {
  dateArrival: Date | undefined;
  dateDeparture: Date | undefined;
  extraDay: boolean;
  taxiArrival: boolean;
  taxiDeparture: boolean;
  roomPreference: string;
  dogsData: DogsData;
  stepsComplete: number;
  client: ClientData | null;
  boardingPrice: number;
  transportationPrice: number;
  extraDayPrice: number;

  // Setters for state updates
  setDateArrival: (dateArrival: Date | undefined) => void;
  setDateDeparture: (dateDeparture: Date | undefined) => void;
  setExtraDay: (extraDay: boolean) => void;
  setTaxiArrival: (taxiArrival: boolean) => void;
  setTaxiDeparture: (taxiDeparture: boolean) => void;
  setRoomPreference: (roomPreference: string) => void;
  setDogsData: (dogsData: DogsData) => void;
  setStepsComplete: (stepsComplete: number) => void;
  setClient: (client: ClientData) => void;
  setBoardingPrice: (price: number) => void;
  setTransportationPrice: (price: number) => void;
  setExtraDayPrice: (price: number) => void;

  // Utility methods
  resetStore: () => void;
  createBooking: () => Promise<void>;
}

export const useBookingStore = create<BookingStoreState>((set, get) => ({
  // Initial state
  dateArrival: undefined,
  dateDeparture: undefined,
  extraDay: false,
  taxiArrival: false,
  taxiDeparture: false,
  roomPreference: "",
  dogsData: [],
  stepsComplete: 0,
  client: null,
  boardingPrice: 0,
  transportationPrice: 0,
  extraDayPrice: 0,

  // Setters
  setDateArrival: (dateArrival) => set({ dateArrival }),
  setDateDeparture: (dateDeparture) => set({ dateDeparture }),
  setExtraDay: (extraDay) => set({ extraDay }),
  setTaxiArrival: (taxiArrival) => set({ taxiArrival }),
  setTaxiDeparture: (taxiDeparture) => set({ taxiDeparture }),
  setRoomPreference: (roomPreference) => set({ roomPreference }),
  setDogsData: (dogsData: DogsData) => {
    set({ dogsData });
  },
  setStepsComplete: (stepsComplete) => set({ stepsComplete }),
  setClient: (client) => set({ client }),
  setBoardingPrice: (price) => set({ boardingPrice: price }),
  setTransportationPrice: (price) => set({ transportationPrice: price }),
  setExtraDayPrice: (price) => set({ extraDayPrice: price }),

  // Reset store to initial state
  resetStore: () =>
    set({
      dateArrival: undefined,
      dateDeparture: undefined,
      extraDay: false,
      taxiArrival: false,
      taxiDeparture: false,
      roomPreference: "",
      dogsData: [],
      stepsComplete: 0,
      client: null,
      boardingPrice: 0,
      transportationPrice: 0,
      extraDayPrice: 0,
    }),

  // Backend logic for creating a booking
  createBooking: async () => {
    const {
      dateArrival,
      dateDeparture,
      extraDay,
      roomPreference,
      client,
      boardingPrice,
      transportationPrice,
      extraDayPrice,
      taxiArrival,
      taxiDeparture,
      dogsData,
    } = get();

    // Ensure required fields are available
    if (!dateArrival || !dateDeparture || !client) {
      console.error("Missing required booking information");
      throw new Error("Missing required booking information");
    }

    // Define path to revalidate (adjust as needed)
    const pathToRevalidate = `/client/${client.clientId}`;

    // Build the booking payload to match the ICreateBooking interface
    const bookingPayload = {
      dateArrival,
      dateDeparture,
      client,
      boardingPrice,
      transportationPrice,
      extraDayPrice,
      flag1: taxiArrival,
      flag2: taxiDeparture,
      dogsData,
      roomPrefer: roomPreference,
      extraDay,
    };

    try {
      console.log("Creating booking with payload:", bookingPayload);
      await createBookingAction({ ...bookingPayload, path: pathToRevalidate });
      console.log("Booking created successfully");
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },
}));
