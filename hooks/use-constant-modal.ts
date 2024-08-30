import { create } from "zustand";

interface UseConstantModalProps {
  openModalType: string | null;
  modalLabel: string | null;
  newConstant: { value: string | null; type: string | null }; // To track the new constant added optimistically
  onOpen: (type: string, label: string) => void;
  onClose: () => void;
  addNewConstantOptimistic: (newValue: string, type: string) => void;
  resetNewConstant: () => void; // To reset the optimistic constant after handling it
}

export const useConstantModal = create<UseConstantModalProps>((set) => ({
  openModalType: null,
  modalLabel: null,
  newConstant: { value: null, type: null }, // Initial value is null

  // Opens the modal and sets the type and label
  onOpen: (type, label) => set({ openModalType: type, modalLabel: label }),

  // Closes the modal by resetting its state
  onClose: () => set({ openModalType: null, modalLabel: null }),

  // Adds a new constant optimistically
  addNewConstantOptimistic: (newValue: string, type: string) =>
    set({ newConstant: { value: newValue, type: type } }),

  // Resets the newConstant value after it's been used for optimistic update
  resetNewConstant: () => set({ newConstant: { value: null, type: null } }),
}));
