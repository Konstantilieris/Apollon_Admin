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
import { updateClientTransportationFee } from "@/lib/actions/client.action";
import { usePathname, useRouter } from "next/navigation";
interface Props {
  id: string;
  transportationFee: number | null;
  name: string;
}

const ClientTransferFee = ({ id, transportationFee, name }: Props) => {
  const [fee, setFee] = useState<number>(transportationFee || 0);
  const { toast } = useToast();
  const path = usePathname();
  const router = useRouter();
  const handleFeePrice = async () => {
    try {
      const res = await updateClientTransportationFee({
        clientId: id,
        price: fee,
        path,
      });
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
            "border-green-500": transportationFee !== null,
            "border-red-500 text-red-700 font-bold animate-pulse":
              transportationFee === null,
          }
        )}
      >
        {transportationFee !== null ? (
          <span className="flex items-center gap-2 p-1 font-semibold text-dark-100 dark:text-green-300">
            <Image
              src={"/assets/icons/car.svg"}
              alt="client"
              width={20}
              height={20}
              className="invert dark:invert-0"
            />
            <span className="font-normal text-light-700">Μεταφορά</span>{" "}
            {transportationFee} €
          </span>
        ) : (
          "Τιμή Μεταφοράς"
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
            {transportationFee !== null && (
              <span className="flex  items-center gap-2 text-green-700 dark:text-green-300">
                {transportationFee} €
              </span>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col items-start gap-2 ">
            <span className="text-lg text-sky-600 dark:text-sky-300">
              Καθορίστε την χρεωση στην μεταφορα του σκυλου του πελάτη
            </span>
            <Input
              value={fee}
              type="number"
              onChange={(e) => setFee(~~e.target.value)}
              className="bg-light-700 text-dark-100 dark:bg-dark-200 dark:text-light-700"
            />
            <span className="ml-2  mt-1 text-[15px] dark:text-green-300 ">
              {fee} € / ημέρα
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-none hover:scale-105">
            Άκυρωση
          </AlertDialogCancel>
          <AlertDialogAction
            className=" text-green-300 hover:scale-110"
            onClick={handleFeePrice}
            disabled={fee === transportationFee || fee === 0}
          >
            Αποθήκευση
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClientTransferFee;