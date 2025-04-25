"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import {
  dateToInt,
  intToDate,
  removeKeysFromQuery,
  formCombinedParams,
} from "@/lib/utils";

export const useUrlDateRange = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ Only set if fr/to exist
  const [rangeDate, setRangeDate] = useState<DateRange>({
    from: searchParams.get("fr")
      ? intToDate(+searchParams.get("fr")!)
      : undefined,
    to: searchParams.get("to")
      ? intToDate(+searchParams.get("to")!)
      : undefined,
  });

  useEffect(() => {
    // 🛑 if no date range is set, do nothing
    if (!rangeDate?.from && !rangeDate?.to) return;
    const debounce = setTimeout(() => {
      const dateFrom = dateToInt(rangeDate?.from);
      const dateTo = dateToInt(rangeDate?.to);

      let newUrl = "";

      if (!rangeDate?.from && !rangeDate?.to) {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["fr", "to"],
        });
      } else if (!rangeDate?.from) {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["fr"],
        });
      } else if (!rangeDate?.to) {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["to"],
        });
      } else {
        newUrl = formCombinedParams(searchParams.toString(), {
          fr: dateFrom.toString(),
          to: dateTo.toString(),
        });
      }

      router.push(newUrl, { scroll: false });
    }, 600);

    return () => clearTimeout(debounce);
  }, [rangeDate]);

  return { rangeDate, setRangeDate };
};
