import { create } from "zustand";
interface BookingStoreState {
  dateArrival: Date | undefined;
  dateDeparture: Date | undefined;
  extraDay: boolean;
  setExtraDay: (extraDay: boolean) => void;
  taxiArrival: boolean;
  taxiDeparture: boolean;
  setDateArrival: (dateArrival: Date | undefined) => void;
  setDateDeparture: (dateDeparture: Date | undefined) => void;
  setTaxiArrival: (taxiArrival: boolean) => void;
  setTaxiDeparture: (taxiDeparture: boolean) => void;
  roomPreference: string;
  setRoomPreference: (roomPreference: string) => void;
  data: any;
  setData: (data: any) => void;
  stepsComplete: number;
  setStepsComplete: (stepsComplete: number) => void;
  resetStore: () => void;
}
export const useBookingStore = create<BookingStoreState>((set) => ({
  dateArrival: undefined,
  dateDeparture: undefined,
  setDateArrival: (dateArrival) => set({ dateArrival }),
  setDateDeparture: (dateDeparture) => set({ dateDeparture }),
  taxiArrival: false,
  taxiDeparture: false,
  extraDay: false,
  setExtraDay: (extraDay) => set({ extraDay }),

  setTaxiArrival: (taxiArrival) => set({ taxiArrival }),
  setTaxiDeparture: (taxiDeparture) => set({ taxiDeparture }),
  roomPreference: "",
  setRoomPreference: (roomPreference) => set({ roomPreference }),
  data: {},
  setData: (data) => set({ data }),
  stepsComplete: 0,
  setStepsComplete: (stepsComplete) => set({ stepsComplete }),
  resetStore: () =>
    set({
      dateArrival: undefined,
      dateDeparture: undefined,
      taxiArrival: false,
      taxiDeparture: false,
      extraDay: false,
      roomPreference: "",
      data: {},
      stepsComplete: 0,
    }),
}));
