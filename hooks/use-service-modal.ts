import { Service } from "@/components/clientProfile/Service/OwesTab";
import { create } from "zustand";

type ServiceModalState = {
  isOpen: boolean;
  selectedServices: Service[];
  type: string; // Store the selected service IDs
  setOpen: () => void;
  onClose: () => void;
  setSelectedServices: (services: Service[], type: string) => void; // Method to update selected services
  resetSelectedServices: () => void; // Method to reset the selected service IDs
};

export const useServiceModal = create<ServiceModalState>((set) => ({
  isOpen: false,
  selectedServices: [], // Initialize selected service IDs as an empty array
  type: "",
  // Method to open the modal
  setOpen: () => set({ isOpen: true }),

  // Method to close the modal
  onClose: () => set({ isOpen: false }),

  // Set selected service IDs (pass an array of service IDs)
  setSelectedServices: (services: Service[], type: string) =>
    set({ selectedServices: services, type }),

  // Reset selected service IDs
  resetSelectedServices: () => set({ selectedServices: [] }),
}));
