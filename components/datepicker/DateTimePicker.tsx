"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconCar } from "@tabler/icons-react";
interface DateTimePickerProps {
  type: string;
  date: Date | undefined;
  setDate: any;
  placeholder: string;
  taxi: Boolean;
  setTaxi: any;
}
export function DateTimePicker({
  type,
  date,
  setDate,
  placeholder,
  taxi,
  setTaxi,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);

      // Set default time to 9 AM if no time is already set
      if (
        date === undefined ||
        date.toDateString() !== newDate.toDateString()
      ) {
        newDate.setHours(9, 0, 0, 0); // 9 AM, 0 minutes, 0 seconds, 0 milliseconds
      } else {
        // Retain the existing time if the same day is selected again
        newDate.setHours(date.getHours(), date.getMinutes());
      }

      setDate(newDate);
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    if (date) {
      const newDate = new Date(date);

      if (type === "hour") {
        newDate.setHours(
          (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
        );
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      } else if (type === "ampm") {
        const currentHours = newDate.getHours();

        if (value === "π.μ") {
          // If "π.μ" (AM) is selected and the current hours are >= 12 (PM), subtract 12 to convert to AM
          if (currentHours >= 12) {
            newDate.setHours(currentHours - 12);
          }
        } else if (value === "μ.μ") {
          // If "μ.μ" (PM) is selected and the current hours are < 12 (AM), add 12 to convert to PM
          if (currentHours < 12) {
            newDate.setHours(currentHours + 12);
          }
        }
      }

      setDate(newDate);
    }
  };
  const isDisabled = (date: Date) => {
    const today = new Date();
    return date.getTime() < today.setHours(0, 0, 0, 0); // Disable dates before today
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-full justify-start text-left  border border-yellow-500 rounded-lg min-h-[46px] font-semibold dark:bg-neutral-900",
            !date && "text-muted-foreground hover:scale-105"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "dd/MM/yyyy hh:mm aa", { locale: el })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex max-h-[44vh] min-h-[46vh] w-auto flex-col overflow-y-hidden p-0 pb-1 dark:bg-neutral-950">
        <div className="flex min-h-[6vh] w-full flex-row items-center border-b px-4 py-2">
          <span className="flex-1">
            Επέλεξε Ημ. & Χρόνο{" "}
            {type === "Arrival"
              ? taxi
                ? "Παραλαβής"
                : "Άφιξης"
              : taxi
                ? "Παράδοσης"
                : "Αναχώρησης"}
          </span>
          <IconCar
            className={cn("h-6 w-6", {
              "text-green-500 animate-pulse": taxi,
              "hover:text-yellow-400": !taxi,
            })}
            onClick={() => setTaxi(!taxi)}
          />
        </div>
        <div className="flex  h-full ">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            locale={el}
            disabled={isDisabled}
          />
          <div className="flex  h-full  max-h-[40vh]  divide-x border-l">
            <ScrollArea>
              <div className="flex flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    className={cn("aspect-square w-full shrink-0 ", {
                      "bg-yellow-600":
                        date && date.getHours() % 12 === hour % 12,
                      "hover:bg-yellow-500 hover:opacity-50": !(
                        date && date.getHours() % 12 === hour % 12
                      ),
                    })}
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <ScrollArea>
              <div className="flex flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    className={cn("aspect-square w-full shrink-0 ", {
                      "bg-yellow-600": date && date.getMinutes() === minute,
                      "hover:bg-yellow-500 hover:opacity-50": !(
                        date && date.getMinutes() === minute
                      ),
                    })}
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <ScrollArea>
              <div className="flex flex-col p-2">
                {["π.μ", "μ.μ"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    className={cn(
                      "aspect-square w-full shrink-0 hover:scale-110",
                      date &&
                        ((ampm === "π.μ" && date.getHours() < 12) ||
                          (ampm === "μ.μ" && date.getHours() >= 12))
                        ? "bg-yellow-600"
                        : "hover:bg-yellow-500 hover:opacity-50"
                    )}
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
