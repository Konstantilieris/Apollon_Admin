"use client";
import React from "react";
import { Button } from "../ui/button";
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
const PendingPaid = ({ clientId, item }: any) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        className="form-button2 ml-12 font-noto_sans font-bold"
      >
        Εξόφληση
      </Button>
      {open && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent className="background-light800_dark400 text-dark200_light800">
            <AlertDialogHeader>
              <AlertDialogTitle>ΕΞΌΦΛΗΣΗ ΤΗΣ ΧΡΕΩΣΗΣ</AlertDialogTitle>
              <AlertDialogDescription>
                Είστε σίγουροι ότι θέλετε να εξοφλήσετε την χρέωση τών{" "}
                {item.amount}€ για την υπηρεσία {item.serviceType} του πελάτη με
                id {clientId}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default PendingPaid;
