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
        className="absolute right-8 top-8 z-50 rounded-full border border-slate-600 bg-slate-700 px-8 py-2 text-sm text-white transition duration-200 hover:scale-110 hover:shadow-2xl hover:shadow-purple-800"
      >
        <div className="absolute inset-x-0 -top-px mx-auto h-px w-1/2 bg-gradient-to-r  from-transparent via-teal-500 to-transparent shadow-2xl" />
        <span className="relative z-20">ΧΡΕΩΣΗ </span>
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
