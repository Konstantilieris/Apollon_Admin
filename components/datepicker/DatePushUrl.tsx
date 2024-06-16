"use client";
import {
  dateToInt,
  formCombinedParams,
  intToDate,
  resetHours,
} from "@/lib/utils";
import { addDays } from "date-fns";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "./DateRangePicker";
import { Button } from "../ui/button";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const DatePushUrl = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [rangeDate, setRangeDate] = useState<DateRange>({
    from: searchParams.get("fr")
      ? intToDate(+searchParams.get("fr")!)
      : resetHours(new Date()),
    to: searchParams.get("to")
      ? intToDate(+searchParams.get("to")!)
      : addDays(resetHours(new Date()), 1),
  });
  const [submit, setSubmit] = useState(false);
  const handleUpdateParams = () => {
    setSubmit(true);
    setTimeout(() => {
      const dateFrom = dateToInt(rangeDate.from);
      const dateTo = dateToInt(rangeDate.to);
      const combinedUrl = formCombinedParams(searchParams.toString(), {
        fr: dateFrom.toString(),
        to: dateTo.toString(),
      });

      // Navigate using the combined URL
      router.push(combinedUrl, { scroll: false });

      setSubmit(false);
    }, 1000);
  };

  return (
    <div className="flex flex-row items-center gap-4">
      <DatePickerWithRange rangeDate={rangeDate} setRangeDate={setRangeDate} />
      <Button
        className="btn text-light850_dark500 border border-blue-500 font-semibold hover:scale-105 "
        disabled={submit || !rangeDate?.from || !rangeDate?.to}
        onClick={handleUpdateParams}
      >
        {submit ? <Loader2 className="animate-spin" /> : "Καταχώρηση"}
      </Button>
    </div>
  );
};

export default DatePushUrl;
