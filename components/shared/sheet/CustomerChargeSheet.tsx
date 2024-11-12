"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import ChargeForm from "@/components/form/ChargeForm";

const CustomerChargeSheet = ({ client, services }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-row gap-2 ">
      <button
        onClick={() => setOpen(true)}
        className=" absolute right-8 top-8 z-20   rounded-full bg-dark-100 px-8 py-2 font-sans  text-white transition duration-200 hover:scale-110  "
      >
        <span className="relative ">ΧΡΕΩΣΗ </span>
        <div className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r  from-transparent via-yellow-500 to-transparent shadow-2xl" />
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className=" background-light900_dark300 text-dark300_light700 p-12 font-sans">
          <SheetHeader>
            <SheetTitle>ΔΗΜΙΟΥΡΓΙΑ ΧΡΕΩΣΗΣ</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <ChargeForm client={client} services={services} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CustomerChargeSheet;
