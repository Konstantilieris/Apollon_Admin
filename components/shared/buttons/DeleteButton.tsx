"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { deleteExpense } from "@/lib/actions/expenses.action";

const DeleteButton = ({ item }: any) => {
  const path = usePathname();
  const handleDelete = async () => {
    try {
      await deleteExpense({ id: item._id, path });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger className="absolute right-2 top-2">
        {" "}
        <Image
          src={"/assets/icons/delete.svg"}
          width={30}
          height={30}
          alt="delete"
        />
      </AlertDialogTrigger>
      <AlertDialogContent className="text-dark200_light800 background-light850_dark100 flex  min-w-[400px] flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle>Είσαι απολύτως σίγουρος;</AlertDialogTitle>
          <AlertDialogDescription>
            Αυτή η πράξη δε μπορεί να αναιρεθεί. Αυτό θα διαγράψει οριστικά το
            έξοδο με περιγραφή : {item.description} από την βάση δεδομένων.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border border-red-500">
            ΑΚΥΡΩΣΗ
          </AlertDialogCancel>
          <AlertDialogAction
            className="dialog_btn max-h-[140px] self-center"
            onClick={handleDelete}
          >
            ΕΠΙΒΕΒΑΙΩΣΗ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
