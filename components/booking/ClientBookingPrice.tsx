"use client";
import React, { useState } from "react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

import { useToast } from "../ui/use-toast";
import { updateClientPrice } from "@/lib/actions/client.action";
import { usePathname, useRouter } from "next/navigation";
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
      const res = await updateClientPrice({ clientId: id, price: daily, path });
      if (res) {
        router.refresh();
        toast({
          title: "Επιτυχία",
          description: "Η τιμή ανανεώθηκε",
          className: cn(
            "bg-celtic-green border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
        });
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
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
          "border-2 min-h-[46px] rounded-lg py-1 px-2 cursor-pointer hover:scale-105",
          {
            "border-green-500": price !== null,
            "border-red-500 text-red-700 font-bold animate-pulse":
              price === null,
          }
        )}
      >
        {price !== null ? (
          <span className="flex items-center gap-2 p-1 font-semibold text-dark-100 dark:text-green-300">
            <Image
              src={"/assets/icons/tag.svg"}
              alt="client"
              width={20}
              height={20}
              className="invert dark:invert-0"
            />
            <span className="font-normal text-light-700">Ημερήσιο </span>{" "}
            {price} €
          </span>
        ) : (
          "Καθορίστε την τιμή"
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-light-500 text-dark-100 dark:bg-dark-100 dark:text-light-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex w-full flex-row ">
            <span className="flex flex-1 items-center gap-2">
              <Image
                src={"/assets/icons/client.svg"}
                alt="client"
                width={20}
                height={20}
              />
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