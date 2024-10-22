import { create } from "zustand";

interface CalendarModalState {
  open: boolean;
  selectedEvent: any | null;
  stage: number;
  pairDate: Date | null;

  onClose: () => void;
  setStage: (stage: number) => void;
  setSelectedEvent: (event: any) => void;
  setPairDate: (date: Date) => void;
  toggleOpen: () => void;
  reset: () => void;
}

const useCalendarModal = create<CalendarModalState>((set) => ({
  open: false,
  selectedEvent: null,
  stage: 0,
  pairDate: null,

  onClose: () => set({ open: false }),
  setStage: (stage) => set({ stage }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setPairDate: (date) => set({ pairDate: date }),
  toggleOpen: () => set((state) => ({ open: !state.open })),
  reset: () =>
    set({ open: false, selectedEvent: null, stage: 0, pairDate: null }),
}));

export default useCalendarModal;
