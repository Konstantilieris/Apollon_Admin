"use client";
import React, { use } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
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
import { useToast } from "../ui/use-toast";
import { payOffClient } from "@/lib/actions/client.action";
import { usePathname } from "next/navigation";
const PendingPaid = ({ clientId, item, firstName, lastName }: any) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const path = usePathname();
  const handlePayment = async () => {
    try {
      const res = await payOffClient({
        clientId,
        serviceId: item._id,
        serviceType: item.serviceType,
        path,
      });
      if (res) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία πληρωμής",
          description: "Η πληρωμή πραγματοποιήθηκε με επιτυχία",
        });
        setOpen(false);
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία πληρωμής",
        description: `${error}`,
      });
      throw error;
    } finally {
      window.location.reload();
    }
  };
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
                onClick={() => handlePayment()}
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
