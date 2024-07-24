"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getDayAndMonth, intToDate2 } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { checkExistingBooking } from "@/lib/actions/booking.action";
import { useSearchParams } from "next/navigation";

interface PendingProps {
  clientName: string;
  clientId: string;
  pending: {
    dogName: string;
    bedName: string;
    roomName: string;
    dogId: string;
  } | null;
  onDelete: () => void;
  fromDate: Date;
  toDate: Date;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const AlertValidate = ({
  open,
  setOpen,
  message,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="bg-light-500 font-sans text-dark-100 dark:bg-dark-100 dark:text-light-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-red-500">
            Aποτυχημένη Eπικύρωση
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg">
            {message}. Προσπαθήστε ξανά !!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Κλείσιμο</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
const PendingBed = ({
  pending,
  onDelete,
  clientName,
  clientId,
  fromDate,
  toDate,
  setOpen,
}: PendingProps) => {
  const searchParams = useSearchParams();
  const [validate, setValidate] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const validateBooking = async () => {
    const frDate = intToDate2(+searchParams.get("fr")!);
    const today = new Date();
    frDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    if (frDate < today) {
      setMessage("Λάθος ημερομηνίες");
      setValidate(true);
    } else {
      const check = await checkExistingBooking({
        clientId,
        rangeDate: {
          from: intToDate2(+searchParams.get("fr")!),
          to: intToDate2(+searchParams.get("to")!),
        },
      });
      setMessage("Έχει ήδη κράτηση");
      setValidate(check);
    }
    validate ? setShow(true) : setOpen(true);
  };
  return (
    <>
      <AlertValidate open={show} setOpen={setShow} message={message} />
      <div className=" flex w-full flex-col items-start pt-1 text-center font-sans text-dark-100 dark:text-light-800">
        <h2 className="flex max-w-[200px] flex-row  gap-2  truncate">
          {" "}
          <Image
            src={"/assets/icons/client.svg"}
            alt="dog"
            width={30}
            height={30}
          />
          {clientName}
        </h2>
        <span className="flex   items-center gap-2 truncate text-sm">
          <Image
            src={"/assets/icons/dog.svg"}
            alt="dog"
            width={30}
            height={30}
          />
          {pending?.dogName}
        </span>
        <span className="ml-1 flex items-center gap-2 text-sm">
          <Image
            src={"/assets/icons/calendar.svg"}
            alt="calendar"
            width={24}
            height={24}
          />
          {getDayAndMonth(fromDate)} - {getDayAndMonth(toDate)}
        </span>
        <div className="flex w-full flex-row justify-between border border-indigo-400 bg-light-500 dark:border-none dark:bg-dark-200 ">
          <Button onClick={onDelete} className="hover:scale-105">
            <Image
              width={24}
              height={24}
              src={"/assets/icons/trash.svg"}
              alt="check"
              className=" hover:animate-pulse hover:cursor-pointer dark:invert  "
            />
          </Button>
          <Button
            className="hover:scale-125"
            onClick={() => validateBooking()}
            disabled={
              !searchParams.has("fr") ||
              !searchParams.has("to") ||
              !searchParams.has("tm1") ||
              !searchParams.has("tm2")
            }
          >
            <Image
              width={40}
              height={34}
              src={"/assets/icons/plus.svg"}
              alt="check"
              className="hover:animate-pulse hover:cursor-pointer dark:invert"
            />
          </Button>
        </div>
      </div>
    </>
  );
};

export default PendingBed;
