import { IBooking } from "@/database/models/booking.model";
import { create } from "zustand";
interface BookingState extends IBooking {
  _id: string;
}
interface EditBookingStoreState {
  dateArrival: Date | undefined;
  booking: BookingState;
  setBooking: (booking: BookingState) => void;
  dateDeparture: Date | undefined;
  extraDay: boolean;
  setExtraDay: (extraDay: boolean) => void;
  taxiArrival: boolean;
  taxiDeparture: boolean;
  setDateArrival: (dateArrival: Date | undefined) => void;
  setDateDeparture: (dateDeparture: Date | undefined) => void;
  setTaxiArrival: (taxiArrival: boolean) => void;
  setTaxiDeparture: (taxiDeparture: boolean) => void;
  resetStore: () => void;
}
export const useEditBookingStore = create<EditBookingStoreState>((set) => ({
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
  booking: {} as BookingState,
  setBooking: (booking) => set({ booking }),
  resetStore: () =>
    set({
      dateArrival: undefined,
      dateDeparture: undefined,
      taxiArrival: false,
      taxiDeparture: false,
      extraDay: false,
    }),
}));
export default useEditBookingStore;
