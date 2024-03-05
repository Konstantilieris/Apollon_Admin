"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ date, setDate }: any) {
  const handleDayBefore = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  };
  const handleDayAfter = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  };

  return (
    <div className="background-light900_dark300 flex max-h-[50px] max-w-[245px] flex-row items-center  rounded-lg">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              " w-[200px]  justify-start text-left   background-light900_dark300 font-noto_sans font-bold dark:text-white"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="background-light900_dark200 text-dark200_light800 w-auto p-0 font-noto_sans text-xl font-bold">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <ChevronLeft
        className="h-4 w-4 hover:scale-125 "
        onClick={handleDayBefore}
      />
      <ChevronRight
        className="h-4 w-4 hover:scale-125"
        onClick={handleDayAfter}
      />
    </div>
  );
}
