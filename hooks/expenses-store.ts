import { ExpenseStatus } from "@/components/expenses/data";
import { create } from "zustand";
type Expense = {
  _id: string;
  date: Date;
  description: string;
  category: {
    name: string;
    _id: string;
  };
  amount: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  vendor: {
    name: string;
    address: string;
    serviceType: string;
    contactInfo: string;
  };
  status: ExpenseStatus;
  notes: string;
};
type ModalType = "create" | "edit" | "delete" | "category";
interface ExpensesStoreState {
  expense: Partial<Expense> | null;
  toDeleteExpenses: Partial<Expense>[] | [];
  setToDeleteExpenses: (toDeleteExpenses: Expense[] | []) => void;
  type: ModalType;
  setType: (type: ModalType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;

  setExpense: (expense: any) => void;
  resetStore: () => void;
}
export const useExpensesStore = create<ExpensesStoreState>((set) => ({
  expense: null,
  type: "create",
  toDeleteExpenses: [],
  setToDeleteExpenses: (toDeleteExpenses) => set({ toDeleteExpenses }),
  setType: (type) => set({ type }),
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  onClose: () => set({ isOpen: false }),
  setExpense: (expense) => set({ expense }),
  resetStore: () =>
    set({
      expense: null,
      type: "create",
      isOpen: false,
    }),
}));
