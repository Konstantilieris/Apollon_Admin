"use client";
import React from "react";
import { Button } from "@/components/ui/button";

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

const PendingPaid = ({ clientId, item, firstName, lastName }: any) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        className="form-button2 ml-12  font-bold"
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
                {item.amount}€ για την υπηρεσία {item.serviceType} του πελάτη{" "}
                {firstName + " " + lastName}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-2 border-red-500">
                Ακύρωση
              </AlertDialogCancel>
              <AlertDialogAction
                className="border-2 border-green-500"
                onClick={() => {}}
              >
                Συνέχεια
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default PendingPaid;
