"use client";
import {
  dateToInt,
  formCombinedParams,
  intToDate,
  removeKeysFromQuery,
} from "@/lib/utils";
import { addDays } from "date-fns";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "./DateRangePicker";

import { useRouter, useSearchParams } from "next/navigation";
interface DatePushProps {
  nodate?: boolean;
  disabled?: boolean;
}
const DatePushUrl = ({ nodate, disabled }: DatePushProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [rangeDate, setRangeDate] = useState<DateRange>({
    from: searchParams.get("fr")
      ? intToDate(+searchParams.get("fr")!)
      : nodate
        ? undefined
        : new Date(),
    to: searchParams.get("to")
      ? intToDate(+searchParams.get("to")!)
      : nodate
        ? undefined
        : addDays(new Date(), 1),
  });

  useEffect(() => {
    const debounceUrl = setTimeout(() => {
      const dateFrom = dateToInt(rangeDate?.from);
      const dateTo = dateToInt(rangeDate?.to);
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
        fr: dateFrom.toString(),
        to: dateTo.toString(),
      });
      router.push(combinedUrl, { scroll: false });
    }, 1000);
    return () => clearTimeout(debounceUrl);
  }, [rangeDate]);

  return (
    <div className="flex flex-row items-center gap-4">
      <DatePickerWithRange
        rangeDate={rangeDate}
        setRangeDate={setRangeDate}
        disabled={disabled}
      />
    </div>
  );
};

export default DatePushUrl;
