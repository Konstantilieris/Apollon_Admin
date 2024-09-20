import { Service } from "@/components/clientProfile/Service/OwesTab";
import { create } from "zustand";

type ServiceModalState = {
  isOpen: boolean;
  setOpen: () => void;
  onClose: () => void;
  currentData: { service: Service | null; type: string };
  setCurrentData: (service: Service, type: string) => void;
  resetCurrentData: () => void;
};

export const useServiceModal = create<ServiceModalState>((set) => ({
  isOpen: false,
  setOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  currentData: { service: null, type: "Payment" },
  setCurrentData: (service, type) => set({ currentData: { service, type } }),
  resetCurrentData: () => set({ currentData: { service: null, type: "" } }),
}));
