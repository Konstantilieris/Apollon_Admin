"use client";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";

import { useExpensesStore } from "@/hooks/expenses-store";
import FormExpense from "../form/FormExpense";
import { CreateCategoryForm } from "./CreateCategory";
import DeleteExpenses from "./DeleteExpenses";

import EditFormExpense from "../form/EditFormExpense";

const ExpenseModal = () => {
  const { isOpen, onClose, type, expense, resetStore } = useExpensesStore();

  // Update the onSubmit function to use console.log instead of making an API call

  const handleClose = () => {
    resetStore();

    onClose();
  };
  const renderContent = () => {
    switch (type) {
      case "create":
        return <FormExpense />;
      case "edit":
        return <EditFormExpense />;
      case "category":
        return <CreateCategoryForm />;
      case "delete":
        return <DeleteExpenses />;
      default:
        return <></>; // Add a default case to handle unexpected values
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      size="2xl"
      onClose={handleClose}
      placement="center"
      backdrop="blur"
    >
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
