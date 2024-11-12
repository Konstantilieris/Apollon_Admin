"use client";
import React, { useState } from "react";

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
import { cn } from "@/lib/utils";
import { Input } from "../../ui/input";

import { useToast } from "../../ui/use-toast";
import { updateClientBookingFee } from "@/lib/actions/client.action";
import { usePathname, useRouter } from "next/navigation";
import { IconCalendar } from "@tabler/icons-react";
interface Props {
  id: string;
  price: number | null;
  name: string;
}

const ClientBookingPrice = ({ id, price, name }: Props) => {
  const [daily, setDaily] = useState<number>(price || 0);
  const { toast } = useToast();
  const path = usePathname();
  const router = useRouter();
  const handleDailyPrice = async () => {
    try {
      const res = await updateClientBookingFee({
        clientId: id,
        price: daily,
        path,
      });
      if (res) {
        router.refresh();
        toast({
          title: "Επιτυχία",
          description: "Η τιμή ανανεώθηκε",
          className: cn(
            "bg-celtic-green border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
        });
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white   text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία",
        description: "Κάτι πήγε στραβά",
      });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(
          "px-8 py-2  bg-neutral-950 text-white text-sm rounded-md font-semibold  hover:shadow-sm hover:shadow-light-800 hover:scale-110 w-full flex justify-center items-center ",
          {
            "border-green-500": price !== null,
            "border-red-500 text-red-700 font-bold animate-pulse":
              price === null,
          }
        )}
      >
        {price !== null ? (
          <IconCalendar size={24} className="text-yellow-600" />
        ) : (
          "ΝΟ"
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-light-500 font-sans text-dark-100 dark:bg-dark-100 dark:text-light-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex w-full flex-row ">
            <span className="flex flex-1 items-center gap-2">
              <IconCalendar size={24} className="text-yellow-500" />
              {name}
            </span>
            {price !== null && (
              <span className="flex  items-center gap-2 text-green-700 dark:text-green-300">
                {price} €
              </span>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col items-start gap-2 ">
            <span className="text-lg text-sky-600 dark:text-sky-300">
              Καθορίστε την ημερήσια χρέωση του πελάτη
            </span>
            <Input
              value={daily}
              type="number"
              onChange={(e) => setDaily(~~e.target.value)}
              className="bg-light-700 text-dark-100 dark:bg-dark-200 dark:text-light-700"
            />
            <span className="ml-2  mt-1 text-[15px] dark:text-green-300 ">
              {daily} € / ημέρα
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-none hover:scale-105">
            Άκυρωση
          </AlertDialogCancel>
          <AlertDialogAction
            className=" text-green-300 hover:scale-110"
            onClick={handleDailyPrice}
            disabled={daily === price || daily === 0}
          >
            Αποθήκευση
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClientBookingPrice;
