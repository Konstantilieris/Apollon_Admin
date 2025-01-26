"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "../ui/reshapedCalendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

interface Props {
  className?: string;
  rangeDate?: DateRange;
  setRangeDate?: any;
  disabled?: boolean;
}
export function DatePickerWithRange({
  className,
  rangeDate,
  setRangeDate,
  disabled,
}: Props) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left   background-light800_dark300 dark:text-light-700 tracking-widest hover:scale-105 border-yellow-500 border min-h-[46px]  rounded-lg",
              !rangeDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-5 w-5" />
            {rangeDate?.from ? (
              <>
                {rangeDate?.from instanceof Date &&
                  format(rangeDate.from, "LLL dd, y", { locale: el })}{" "}
                -{" "}
                {rangeDate?.to instanceof Date &&
                  format(rangeDate.to, "LLL dd, y", { locale: el })}
              </>
            ) : (
              <span>Διάλεξε ημερομηνίες</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="text-dark200_light800 w-auto  p-0 dark:bg-neutral-900  "
          align="start"
        >
          <Calendar
            className="font-sans"
            disabled={disabled && { before: new Date() }}
            initialFocus
            mode="range"
            defaultMonth={rangeDate?.from}
            selected={rangeDate}
            onSelect={setRangeDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
