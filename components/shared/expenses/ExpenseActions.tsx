"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { deleteExpense } from "@/lib/actions/expenses.action";
import { formatDateUndefined } from "@/lib/utils";
const ExpenseActions = ({ expense }: { expense: any }) => {
  const [action, setAction] = React.useState<string>("");
  const handleDelete = async () => {
    await deleteExpense({ id: expense._id, path: "/expenses" });
    setAction("");
    window.location.reload();
  };

  return (
    <>
      <Select onValueChange={setAction} value={action}>
        <SelectTrigger className="w-[70px] ">
          <SelectValue placeholder="..." />
        </SelectTrigger>
        <SelectContent className="background-light900_dark300 text-light850_dark500 max-w-[40px] ">
          <SelectItem value="edit" className="ml-4 hover:scale-105">
            <Image
              src="/assets/icons/edit.svg"
              width={23}
              height={23}
              alt="delete"
            />
          </SelectItem>
          <SelectItem
            value="delete"
            className="ml-4 self-center hover:scale-105"
          >
            <Image
              src="/assets/icons/trash.svg"
              width={23}
              height={23}
              alt="delete"
            />
          </SelectItem>
        </SelectContent>
      </Select>
      <AlertDialog open={action === "delete"}>
        <AlertDialogContent className="background-light800_dark400 text-dark100_light900 min-h-[200px] font-noto_sans">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Διαγραφή Δαπάνης{" "}
              {formatDateUndefined(new Date(expense?.date), "el")}-{" "}
              {expense?.description}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Είστε σίγουροι ότι θέλετε να διαγράψετε την δαπάνη;
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="h-11 w-24 rounded-lg border border-red-600 p-2 hover:scale-105"
              onClick={() => setAction("")}
            >
              Ακύρωση
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="h-11 w-24 rounded-lg border border-red-500 bg-white p-2 text-white hover:border-none hover:bg-red-800 hover:text-white"
            >
              <Image
                src="/assets/icons/trash.svg"
                width={20}
                height={20}
                alt="delete"
                className="invert-0"
              />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ExpenseActions;
