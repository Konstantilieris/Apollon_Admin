import { create } from "zustand";

type ModalType =
  | "services"
  | "payments"
  | "clientInfo"
  | "deleteClient"
  | "editDog"
  | "createDog"
  | "createService"
  | "fullPayServices"
  | "partialPayService"
  | "taxService"
  | "discountService"
  | "deleteServices"
  | "editService"
  | "dogNotes"
  | "clientNotes"
  | "deleteDog"
  | "serviceView"
  | "editBooking"
  | "deleteBookings"
  | "viewBooking"
  | "deleteServicesTableAction"
  | "extraCalendarServices"
  | null;

interface ModalState {
  modalType: ModalType;
  modalData: any;
  isOpen: boolean;

  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalType: null,
  modalData: null,
  isOpen: false,

  openModal: (type, data = null) =>
    set({
      modalType: type,
      modalData: data,
      isOpen: true,
    }),

  closeModal: () =>
    set({
      modalType: null,
      modalData: null,
      isOpen: false,
    }),
}));
