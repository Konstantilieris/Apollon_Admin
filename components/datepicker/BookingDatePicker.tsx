"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
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
interface BookingDateProps {
  date: DateRange | undefined;
  setDate: any;
  taxiArrival: Boolean;
  setTaxiArrival: any;
  taxiDeparture: Boolean;
  setTaxiDeparture: any;
  className?: string;
}
export function BookingDatePicker({
  date,
  setDate,
  taxiArrival,
  setTaxiArrival,
  taxiDeparture,
  setTaxiDeparture,
  className,
}: BookingDateProps) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const handleTimeChange1 = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    if (date?.from) {
      const newDate = new Date(date.from);

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

      setDate({ from: newDate, to: date.to });
    }
  };
  const handleTimeChange2 = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    if (date?.to) {
      const newDate = new Date(date.to);

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

      setDate({ from: date.from, to: newDate });
    }
  };
  const isDisabled = (date: Date) => {
    const today = new Date();
    return date.getTime() < today.setHours(0, 0, 0, 0); // Disable dates before today
  };

  return (
    <div className={cn("grid gap-2 ", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "w-full justify-start text-left  border border-yellow-500 rounded-lg min-h-[60px] font-semibold dark:bg-neutral-900 min-w-[322px] text-[1rem] max-w-[380px]",
              !date && "text-muted-foreground hover:scale-105 "
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd MMMM ", { locale: el })} -{" "}
                  {format(date.to, "dd MMMM ", { locale: el })}
                </>
              ) : (
                format(date.from, "dd MMMM ", { locale: el })
              )
            ) : (
              <span>Check-in date — Check-out date</span> // "Pick a date" in Greek
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          className="flex max-h-[44vh] min-h-[46vh] w-auto flex-col overflow-hidden p-0 pb-1 dark:bg-neutral-950"
        >
          <div className="relative flex min-h-[6vh] w-full flex-row items-center gap-12 border-b px-4 py-2 font-sans">
            <span className="w-[62%] ">Επιλέξτε ημερομηνίες</span>

            <span
              className={cn(
                "absolute right-56 flex flex-row items-center gap-12 rounded-lg bg-dark-200/80 px-2 py-1 border border-yellow-500 ",
                {
                  "text-green-500 gap-3": taxiArrival,
                }
              )}
            >
              <IconCar
                size={30}
                className={cn("w-full", {
                  "text-green-500 ": taxiArrival,
                  "hover:text-yellow-400 hover:scale-105 animate-pulse":
                    !taxiArrival,
                })}
                onClick={() => setTaxiArrival(!taxiArrival)}
              />{" "}
              {taxiArrival ? "ΠΑΡΑΛΑΒΗ" : "ΑΦΙΞΗ"}
            </span>
            <span
              className={cn(
                "absolute right-3   flex flex-row items-center gap-7 rounded-lg bg-dark-200/80 px-2 py-1 border border-yellow-500",
                {
                  "text-green-500 gap-10": taxiDeparture,
                }
              )}
            >
              <IconCar
                size={30}
                className={cn("w-full", {
                  "text-green-500 ": taxiDeparture,
                  "hover:text-yellow-400 hover:scale-105 animate-pulse":
                    !taxiDeparture,
                })}
                onClick={() => setTaxiDeparture(!taxiDeparture)}
              />
              {taxiDeparture ? "ΠΑΡΑΔΟΣΗ" : "ΑΝΑΧΩΡΗΣΗ"}
            </span>
          </div>
          <div className="flex  h-full ">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              locale={el}
              disabled={isDisabled}
            />
            <div className="flex  h-full  max-h-[40vh]  divide-x border-l font-sans">
              <ScrollArea>
                <div className="flex flex-col p-2 ">
                  {hours.toReversed().map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      className={cn("aspect-square w-full shrink-0 ", {
                        "bg-yellow-600":
                          date?.from && date.from.getHours() % 12 === hour % 12,
                        "hover:bg-yellow-500 hover:opacity-50": !(
                          date?.from && date.from.getHours() % 12 === hour % 12
                        ),
                      })}
                      onClick={() => handleTimeChange1("hour", hour.toString())}
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
                        "bg-yellow-600":
                          date?.from && date.from.getMinutes() === minute,
                        "hover:bg-yellow-500 hover:opacity-50": !(
                          date?.from && date?.from.getMinutes() === minute
                        ),
                      })}
                      onClick={() =>
                        handleTimeChange1("minute", minute.toString())
                      }
                    >
                      {minute}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex flex-col pb-2">
                <div className="flex flex-1 flex-col p-2">
                  {["π.μ", "μ.μ"].map((ampm) => (
                    <Button
                      key={ampm}
                      size="icon"
                      className={cn(
                        "aspect-square w-full shrink-0 hover:scale-110",
                        date?.from &&
                          ((ampm === "π.μ" && date.from.getHours() < 12) ||
                            (ampm === "μ.μ" && date.from.getHours() >= 12))
                          ? "bg-yellow-600"
                          : "hover:bg-yellow-500 hover:opacity-50"
                      )}
                      onClick={() => handleTimeChange1("ampm", ampm)}
                    >
                      {ampm}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex  h-full  max-h-[40vh]  divide-x border-l font-sans">
              <ScrollArea>
                <div className="flex flex-col p-2">
                  {hours.toReversed().map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      className={cn("aspect-square w-full shrink-0 ", {
                        "bg-yellow-600":
                          date?.to && date.to.getHours() % 12 === hour % 12,
                        "hover:bg-yellow-500 hover:opacity-50": !(
                          date?.to && date.to.getHours() % 12 === hour % 12
                        ),
                      })}
                      onClick={() => handleTimeChange2("hour", hour.toString())}
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
                        "bg-yellow-600":
                          date?.to && date.to.getMinutes() === minute,
                        "hover:bg-yellow-500 hover:opacity-50": !(
                          date?.to && date?.to.getMinutes() === minute
                        ),
                      })}
                      onClick={() =>
                        handleTimeChange2("minute", minute.toString())
                      }
                    >
                      {minute}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex flex-col pb-2">
                <div className="flex flex-1 flex-col p-2">
                  {["π.μ", "μ.μ"].map((ampm) => (
                    <Button
                      key={ampm}
                      size="icon"
                      className={cn(
                        "aspect-square w-full shrink-0 hover:scale-110",
                        date?.to &&
                          ((ampm === "π.μ" && date.to.getHours() < 12) ||
                            (ampm === "μ.μ" && date.to.getHours() >= 12))
                          ? "bg-yellow-600"
                          : "hover:bg-yellow-500 hover:opacity-50"
                      )}
                      onClick={() => handleTimeChange2("ampm", ampm)}
                    >
                      {ampm}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
