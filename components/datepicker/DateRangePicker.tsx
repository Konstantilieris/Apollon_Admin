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
              "w-[300px] justify-start text-left   background-light800_dark300 text-dark300_light700 hover:scale-105 border-yellow-500 border-2 min-h-[46px] font-semibold",
              !rangeDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
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
          className="text-dark200_light800 background-light850_dark100  w-auto p-0  font-semibold"
          align="start"
        >
          <Calendar
            className=""
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
