"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ChargeForm from "@/components/form/ChargeForm";
import { useRouter } from "next/navigation";
const CustomerChargeSheet = ({ client }: any) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="flex flex-row gap-2">
      <Button
        className="gap-2 border-2 border-white bg-purple-600 p-4 font-sans text-[17px] font-bold text-white hover:scale-105"
        onClick={() => {
          router.push(`/booking/${client._id}`);
        }}
      >
        Νέα Κράτηση
        <Image
          src="/assets/icons/edit.svg"
          alt="plus"
          width={23}
          height={20}
          className="invert"
        />
      </Button>
      <Button
        className="gap-2 border-2 border-white bg-green-600 p-4 font-sans text-[17px] font-bold text-white hover:scale-105"
        onClick={() => {
          setOpen(!open);
        }}
      >
        Νέα Χρέωση
        <Image
          src="/assets/icons/edit.svg"
          alt="plus"
          width={23}
          height={20}
          className="invert"
        />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className=" background-light900_dark300 text-dark300_light700 p-8">
          <SheetHeader>
            <SheetTitle>Καινούργια Χρέωση</SheetTitle>
            <SheetDescription>
              Συμπληρώστε τα παρακάτω πεδία για να πραγματοποιήσετε την χρέωση
              στον πελάτη {client.name}
            </SheetDescription>
          </SheetHeader>
          <ChargeForm id={client._id} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CustomerChargeSheet;
