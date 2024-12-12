"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { el } from "date-fns/locale";
import {
  cn,
  dateToInt,
  formCombinedParams,
  removeKeysFromQuery,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useSearchParams, useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";

interface BookingDateProps {
  className?: string;
  useHook: any;
}
export function BookingDatePicker({ className, useHook }: BookingDateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDisabled = (date: Date) => {
    const today = new Date();
    return date.getTime() < today.setHours(0, 0, 0, 0); // Disable dates before today
  };
  const { dateArrival, dateDeparture, setDateArrival, setDateDeparture } =
    useHook();
  const [rangeDate, setRangeDate] = React.useState<DateRange | undefined>(
    dateArrival && dateDeparture
      ? {
          from: dateArrival,
          to: dateDeparture,
        }
      : undefined
  );
  const debounceTimer = React.useRef<any | null>(null);
  const handleRangeDate = (dateRange: DateRange | undefined) => {
    setRangeDate(dateRange);
    setDateArrival(dateRange?.from);
    setDateDeparture(dateRange?.to);

    // Clear any existing debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Start a new debounce timer
    debounceTimer.current = setTimeout(() => {
      const dateFromUrl = dateToInt(dateRange?.from);
      const dateToUrl = dateToInt(dateRange?.to);

      if (!dateRange?.from && !dateRange?.to) {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["fr", "to"],
        });
        router.push(newUrl, { scroll: false });
        return;
      } else if (!dateRange?.from) {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["fr"],
        });
        router.push(newUrl, { scroll: false });
        return;
      } else if (!dateRange?.to) {
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
    }, 500); // Adjust debounce time as needed
  };
  React.useEffect(() => {
    if (!dateArrival && !dateDeparture) {
      setRangeDate(undefined);
      const newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["fr", "to"],
      });
      router.push(newUrl, { scroll: false });
    }
  }, [dateArrival, dateDeparture]);
  return (
    <div className={cn("grid gap-2 ", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "w-full justify-start text-left  border border-yellow-500 rounded-lg min-h-[60px]  dark:bg-neutral-900 min-w-[322px] text-lg max-w-[380px]",
              !rangeDate && "text-muted-foreground hover:scale-105 "
            )}
          >
            <CalendarIcon className="mr-2 h-6 w-6" />
            {rangeDate?.from ? (
              rangeDate.to ? (
                <>
                  {format(rangeDate.from, "dd MMMM ", { locale: el })} -{" "}
                  {format(rangeDate.to, "dd MMMM ", { locale: el })}
                </>
              ) : (
                format(rangeDate.from, "dd MMMM ", { locale: el })
              )
            ) : (
              <span>Check-in date — Check-out date</span> // "Pick a date" in Greek
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          className="flex max-h-[44vh] min-h-[46vh] w-auto flex-col overflow-hidden p-0  dark:bg-neutral-950"
        >
          <div className="flex  h-full ">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={rangeDate?.from}
              selected={rangeDate}
              onSelect={handleRangeDate}
              numberOfMonths={2}
              locale={el}
              disabled={isDisabled}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
