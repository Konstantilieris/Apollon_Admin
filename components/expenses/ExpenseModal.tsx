"use client";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../ui/use-toast";
import {
  createExpense,
  getAllCategories,
  updateExpense,
} from "@/lib/actions/expenses.action";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useExpensesStore } from "@/hooks/expenses-store";
import FormExpense from "../form/FormExpense";
import { CreateCategoryForm } from "./CreateCategory";
import DeleteExpenses from "./DeleteExpenses";

type Expense = {
  id?: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  date: Date;
  description: string;
  category: string;
  paymentMethod?: string;
  vendor?: {
    name?: string;
    contactInfo?: string;
    serviceType?: string;
  };
  notes?: string;
  status: "pending" | "paid" | "overdue";
};

type Category = {
  id: string;
  name: string;
};
const ExpenseModal = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { isOpen, onClose, type, expense, resetStore } = useExpensesStore();

  const form = useForm<Expense>({
    defaultValues: {
      amount: 0,
      taxAmount: 24,

      date: new Date(),
      description: "",
      category: "",
      paymentMethod: "",
      vendor: {
        name: "",
        contactInfo: "",
        serviceType: "",
      },
      notes: "",
      status: "paid",
    },
  });

  useEffect(() => {
    if (expense) {
      form.reset({
        ...expense,
        category: expense.category?._id || "",
      });
    }
  }, [expense, form]);

  // Replace the existing fetchCategories function in the useEffect hook with this:
  useEffect(() => {
    async function fetchCategories() {
      try {
        // Simulate an API call delay
        const res = await getAllCategories();

        setCategories(res);
      } catch (error) {
        console.error("Failed to fetch categories:", error);

        // Use mock data as fallback
        setCategories([]);
      }
    }

    fetchCategories();
  }, []);

  // Update the onSubmit function to use console.log instead of making an API call
  const onSubmit = async (data: Expense) => {
    setIsLoading(true);
    try {
      // Simulate API call
      const res = await createExpense(data);
      if (res.success) {
        toast({
          title: "Επιτυχία",
          description: "Η δαπάνη δημιουργήθηκε με επιτυχία",
          className: cn(
            "bg-celtic-green border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed font-sans "
          ),
        });
        onClose();
      }
      console.log("Expense data submitted:", data);
    } catch (error) {
      console.error("Error saving expense:", error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };
  const onUpdate = async (data: Expense) => {
    setIsLoading(true);
    try {
      if (!expense) return;
      const res = await updateExpense(expense?._id!, data);
      if (res.success) {
        toast({
          title: "Επιτυχία",
          description: "Η δαπάνη ενημερώθηκε με επιτυχία",
          className: cn(
            "bg-celtic-green border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed font-sans "
          ),
        });
        onClose();
      }
      console.log("Expense data submitted:", data);
    } catch (error) {
      console.error("Error saving expense:", error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };
  const handleClose = () => {
    resetStore();
    onClose();
  };
  const renderContent = () => {
    switch (type) {
      case "create":
        return (
          <FormExpense
            form={form}
            onSubmit={onSubmit}
            categories={categories}
            isLoading={isLoading}
            type={type}
            expense={null}
          />
        );
      case "edit":
        return (
          <FormExpense
            form={form}
            onSubmit={onUpdate}
            categories={categories}
            isLoading={isLoading}
            expense={expense}
            type={type}
          />
        );
      case "category":
        return <CreateCategoryForm />;
      case "delete":
        return <DeleteExpenses />;
      default:
        return <></>; // Add a default case to handle unexpected values
    }
  };
  return (
    <Modal isOpen={isOpen} size="2xl" onClose={handleClose} placement="center">
      <ModalContent className="font-sans">
        {() => (
          <>
            <ModalHeader className="flex flex-col items-center gap-1 pl-8 tracking-widest">
              {expense ? "ΕΠΕΞΕΡΓΑΣΙΑ" : "ΠΡΟΣΘΗΚΗ"} ΕΞΟΔΟΥ
            </ModalHeader>
            <ModalBody>{renderContent()}</ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default ExpenseModal;
