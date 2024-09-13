"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, CaptionProps, useNavigation } from "react-day-picker";
import { format, addMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { el } from "date-fns/locale";
export type CalendarProps = React.ComponentProps<typeof DayPicker>;
function CustomCaption(props: CaptionProps) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      nextMonth && goToMonth(nextMonth);
    }
    if (e.key === "ArrowLeft") {
      previousMonth && goToMonth(previousMonth);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      previousMonth && goToMonth(addMonths(previousMonth, -11));
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      nextMonth && goToMonth(addMonths(nextMonth, 11));
    }
  };
  return (
    <div
      className="flex max-w-[70px] flex-row items-center justify-start"
      onKeyDown={(e) => handleKeyDown(e)}
    >
      {format(props.displayMonth, "MMM yyy", { locale: el })}
      <Button
        disabled={!previousMonth}
        onClick={() =>
          previousMonth && goToMonth(addMonths(previousMonth, -11))
        }
      >
        <ChevronLeft width={30} />
      </Button>
      <Button
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
      >
        <ChevronLeft width={20} />
      </Button>
      <Button
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
      >
        <ChevronRight width={20} />
      </Button>
      <Button
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(addMonths(nextMonth, 11))}
      >
        <ChevronRight width={30} />
      </Button>
    </div>
  );
}
function Calendar({
  className,

  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={el}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-lg font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[1.1rem] ",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-lg p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-yellow-500 hover:opacity-50"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-yellow-600 hover:scale-105 hover:text-primary-foreground focus:bg-yellow-600 focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: CustomCaption,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
