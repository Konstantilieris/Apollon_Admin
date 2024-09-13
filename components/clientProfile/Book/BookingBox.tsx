"use client";
import { BookingDatePicker } from "@/components/datepicker/BookingDatePicker";

import { Button } from "@/components/ui/button";
import {
  dateToInt,
  formCombinedParams,
  removeKeysFromQuery,
} from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import BookingSuggestion from "./RoomResults/BookingSuggestion";

const BookingBox = ({ client }: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rangeDate, setRangeDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const [taxiArrival, setTaxiArrival] = useState<Boolean>(false);
  const [taxiDeparture, setTaxiDeparture] = useState<Boolean>(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const debounceUrl = setTimeout(() => {
      const dateFromUrl = dateToInt(rangeDate?.from);

      const dateToUrl = dateToInt(rangeDate?.to);
      if (!rangeDate?.from && !rangeDate?.to) {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["fr", "to"],
        });
        router.push(newUrl, { scroll: false });
        return;
      } else if (!rangeDate?.from) {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["fr"],
        });
        router.push(newUrl, { scroll: false });
        return;
      } else if (!rangeDate?.to) {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["to"],
        });
        router.push(newUrl, { scroll: false });
        return;
      }

      const combinedUrl = formCombinedParams(searchParams.toString(), {
        fr: dateFromUrl.toString(),
        to: dateToUrl.toString(),
      });
      router.push(combinedUrl, { scroll: false });
    }, 1000);
    return () => clearTimeout(debounceUrl);
  }, [rangeDate?.from, rangeDate?.to]);

  return (
    <div className=" relative flex w-full flex-row items-center justify-center rounded-full bg-dark-100">
      <div className="absolute flex flex-row items-center gap-2">
        <BookingDatePicker
          date={rangeDate}
          setDate={setRangeDate}
          taxiArrival={taxiArrival}
          setTaxiArrival={setTaxiArrival}
          taxiDeparture={taxiDeparture}
          setTaxiDeparture={setTaxiDeparture}
        />

        <Button
          className="min-h-[60px] min-w-[174px] rounded-lg border border-yellow-500 text-[1rem] font-semibold hover:scale-105 dark:bg-neutral-900"
          disabled={
            !rangeDate?.from ||
            !rangeDate.to ||
            !searchParams.get("fr") ||
            !searchParams.get("to")
          }
          onClick={() => setOpen(!open)}
        >
          ΚΑΤΑΧΩΡΗΣΗ
          {rangeDate?.from && rangeDate.to && (
            <IconCheck className="ml-2 h-5 w-5 text-yellow-500" />
          )}
        </Button>
      </div>

      {open && (
        <BookingSuggestion
          rangeDate={rangeDate}
          taxiArrival={taxiArrival}
          client={client}
          taxiDeparture={taxiDeparture}
          setOpen={setOpen}
          open={open}
        />
      )}
    </div>
  );
};

export default BookingBox;
