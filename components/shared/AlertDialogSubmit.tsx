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
import { cn, formatDate, formatTime } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useToast } from "../ui/use-toast";
import { Input } from "../ui/input";

interface SelectedClient {
  firstName: string;
  lastName: string;
  id: string;
  email?: string;
}
interface Params {
  selectedClient: SelectedClient;
  rangeDate: { from: Date; to: Date };
  flag: boolean;
  open: boolean;
  setOpen: any;
  bookingData: any;
  timeArrival: Date;
  timeDeparture: Date;
  close: any;
}
const AlertDialogSubmit = ({
  open,
  close,
  setOpen,
  selectedClient,
  rangeDate,
  bookingData,
  flag,
  timeArrival,
  timeDeparture,
}: Params) => {
  const { toast } = useToast();
  const path = usePathname();

  const [price, setPrice] = useState(0);
  const handleBookingAction = async () => {
    try {
      const booking = await CreateBooking({
        clientId_string: selectedClient.id,
        rangeDate,
        totalprice: price,
        path,
        flag,
        bookingData,
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
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Failed to create Booking",
        description: `${error}`,
      });
    } finally {
      setOpen(!open);
      close(false);
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
            <span>
              Όνομα Πελάτη: {selectedClient?.firstName}{" "}
              {selectedClient?.lastName}
            </span>
            <span className="flex flex-col gap-2">
              {bookingData.map((item: any) => (
                <span key={item.dogId}>
                  &bull; {item.dogName} στο Δωμάτιο {item.roomName}{" "}
                </span>
              ))}
            </span>
            <span>
              {!rangeDate?.from && !timeArrival
                ? "Δεν εχέτε επιλέξει ημερές"
                : `Απο : ${formatDate(rangeDate?.from, "el")}, ${
                    flag ? "και ώρα παραλαβής" : "και ώρα άφιξης"
                  } ${formatTime(timeArrival, "el")}.`}
            </span>
            <span>
              {!rangeDate?.to && !timeDeparture
                ? "Δεν εχέτε επιλέξει ημερές"
                : `Μέχρι: ${formatDate(rangeDate?.to, "el")}, ${
                    flag ? "και ώρα παράδοσης" : "και ώρα αναχώρησης"
                  } ${formatTime(timeDeparture, "el")}.`}
            </span>
            <span className="flex flex-row items-center gap-2">
              Τροποποίησε την τιμή :
              <Input
                className="background-light800_dark400 max-w-[80px]"
                type="number"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
              />
            </span>
            <span>Συνολική Τιμή : {price?.toString()} Ευρώ</span>
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
};
export default AlertDialogSubmit;
