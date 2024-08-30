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
import React from "react";
import { IconGrave } from "@tabler/icons-react";
interface DeadDogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleDeadDog: () => void;
  dialogRef: React.RefObject<HTMLDivElement>;
}
const AlertDeadDog = ({
  open,
  setOpen,
  handleDeadDog,
  dialogRef,
}: DeadDogProps) => (
  <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogContent className="z-[5000] dark:bg-dark-100" ref={dialogRef}>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          Είστε σίγουροι ότι ο σκύλος είναι νεκρός;
          <IconGrave className="h-6 w-6 text-red-500" />
        </AlertDialogTitle>
        <AlertDialogDescription>
          Αυτή η ενέργεια δεν μπορεί να αναιρεθεί και θα αφαιρέσει τον σκύλο από
          την λίστα
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="hover:scale-110">
          ΑΚΥΡΩΣΗ
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={() => {
            handleDeadDog();
          }}
          className="hover:scale-110"
        >
          ΣΥΝΕΧΕΙΑ
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
export default AlertDeadDog;
