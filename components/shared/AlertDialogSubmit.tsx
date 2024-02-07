"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CreateBooking } from "@/lib/actions/booking.action";
import { calculateTotal, cn, formatDate, formatTime } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React from "react";
import { useToast } from "../ui/use-toast";

interface SelectedClient {
  firstName: string;
  lastName: string;
  id: string;
  email: string;
}
interface Params {
  selectedClient: SelectedClient;
  rangeDate: { from: Date; to: Date };
  roomId: string;
  roomName: string;
  price: string;
  open: boolean;
  setOpen: any;
  form: any;
  timeArrival: Date | undefined;
  timeDeparture: Date | undefined;
}
export function AlertDialogSubmit({
  open,
  setOpen,
  selectedClient,
  rangeDate,
  roomId,
  roomName,
  price,
  form,
  timeArrival,
  timeDeparture,
}: Params) {
  const totalPrice = calculateTotal(
    rangeDate?.from,
    timeArrival,
    rangeDate?.to,
    timeDeparture,
    parseInt(price)
  );
  const { toast } = useToast();
  const path = usePathname();

  const handleBookingAction = async () => {
    try {
      const booking = await CreateBooking({
        roomId,
        clientId_string: selectedClient.id,
        rangeDate,
        totalprice: totalPrice,
        path,
        timeArrival: formatTime(timeArrival, "el"),
        timeDeparture: formatTime(timeDeparture, "el"),
      });
      if (booking) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: "Η κράτηση δημιουργήθηκε",
        });
      }
      window.location.reload();
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Failed to create Booking",
        description: `${error}`,
      });
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="text-dark200_light800 background-light850_dark100 flex  min-w-[400px] flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-noto_sans font-bold">
            Γίνεται κράτηση:
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col font-noto_sans text-lg">
            <span>Δωμάτιο: {roomName}</span>
            <span>
              Όνομα Πελάτη: {selectedClient?.firstName}{" "}
              {selectedClient?.lastName}
            </span>
            <span>
              {!rangeDate?.from && !timeArrival
                ? "Δεν εχέτε επιλέξει ημερές"
                : `Απο : ${formatDate(
                    rangeDate?.from,
                    "el"
                  )}, και ώρα άφιξης ${formatTime(timeArrival, "el")}.`}
            </span>
            <span>
              {!rangeDate?.to && !timeDeparture
                ? "Δεν εχέτε επιλέξει ημερές"
                : `Μέχρι: ${formatDate(rangeDate?.to, "el")}, ${formatTime(
                    timeDeparture,
                    "el"
                  )}.`}
            </span>

            <span>
              Συνολική Τιμή :{" "}
              {calculateTotal(
                rangeDate?.from,
                timeArrival,
                rangeDate?.to,
                timeDeparture,
                parseInt(price)
              )?.toString()}{" "}
              Ευρώ
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            className="drawer_btn_close max-h-[120px] self-center"
            onClick={() => {
              setOpen(!open);
            }}
          >
            {" "}
            ΑΚΥΡΩΣΗ{" "}
          </Button>

          <AlertDialogAction
            className="dialog_btn max-h-[140px] self-center"
            onClick={() => handleBookingAction()}
          >
            ΕΠΙΒΕΒΑΙΩΣΗ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
