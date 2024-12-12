"use client";
import { BookingDatePicker } from "@/components/datepicker/BookingDatePicker";

import { Button } from "@/components/ui/button";

import { IconCheck } from "@tabler/icons-react";

import React, { useState } from "react";

import BookingSuggestion from "./RoomResults/BookingSuggestion";

import { useBookingStore } from "@/hooks/booking-store";

const BookingBox = ({ client }: any) => {
  const { dateArrival, dateDeparture, setStepsComplete } = useBookingStore();

  const [open, setOpen] = useState(false);

  return (
    <div className=" relative flex w-full flex-row items-center justify-center rounded-full bg-dark-100">
      <div className="absolute flex flex-row items-center gap-2">
        <BookingDatePicker useHook={useBookingStore} />

        <Button
          className="min-h-[60px] min-w-[174px] rounded-lg border border-yellow-500   text-lg tracking-wider hover:scale-105 dark:bg-neutral-900"
          disabled={!dateArrival || !dateDeparture}
          onClick={() => {
            setOpen(true);
            setStepsComplete(0);
          }}
        >
          ΚΑΤΑΧΩΡΗΣΗ
          {dateArrival && dateDeparture && (
            <IconCheck className="ml-2 h-5 w-5 text-yellow-500" />
          )}
        </Button>
      </div>

      {open && dateArrival && dateDeparture && (
        <BookingSuggestion client={client} setOpen={setOpen} />
      )}
    </div>
  );
};

export default BookingBox;
