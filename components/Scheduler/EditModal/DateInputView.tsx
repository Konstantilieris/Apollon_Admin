import { cn } from "@/lib/utils";
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconCar } from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon } from "@radix-ui/react-icons";
import { el } from "date-fns/locale";
import { format } from "date-fns";
interface Props {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  taxi: boolean;
  setTaxi: (taxi: boolean) => void;
  isArrival: boolean;
  pairDate: Date;
  className?: string;
}
const DateInputView = ({
  date,
  setDate,
  taxi,
  setTaxi,
  isArrival,
  pairDate,
  className,
}: Props) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
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
    if (isArrival) {
      return (
        date.getTime() < pairDate.getTime() &&
        date.getTime() < today.setHours(0, 0, 0, 0)
      );
    } else {
      return (
        date.getTime() > pairDate.getTime() &&
        date.getTime() < today.setHours(0, 0, 0, 0)
      );
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "w-full justify-start text-left  border border-yellow-500 rounded-lg min-h-[60px] font-semibold dark:bg-neutral-900 min-w-[322px] text-[1rem]",
              !date && "text-muted-foreground hover:scale-105"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "dd/MM/yyyy") : "Επιλέξτε ημερομηνία"}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          className="flex max-h-[44vh] min-h-[46vh] w-auto flex-col overflow-hidden p-0 pb-1 dark:bg-neutral-950"
        >
          <div className="relative flex min-h-[6vh] w-full flex-row items-center gap-12 border-b px-4 py-2">
            <span className="w-[62%] ">Επιλέξτε ημερομηνίες</span>

            <span
              className={cn(
                "absolute right-56 flex flex-row items-center gap-12 rounded-lg bg-dark-200/80 px-2 py-1 border border-yellow-500 ",
                {
                  "text-green-500 gap-3": taxi,
                }
              )}
            >
              <IconCar
                size={30}
                className={cn("w-full", {
                  "text-green-500 ": taxi,
                  "hover:text-yellow-400 hover:scale-105 animate-pulse": !taxi,
                })}
                onClick={() => setTaxi(!taxi)}
              />{" "}
              {taxi ? "ΠΑΡΑΛΑΒΗ" : "ΑΦΙΞΗ"}
            </span>
          </div>
          <div className="flex  h-full ">
            <Calendar
              initialFocus
              mode="single"
              defaultMonth={date}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              locale={el}
              disabled={isDisabled}
            />
            <div className="flex  h-full  max-h-[40vh]  divide-x border-l">
              <ScrollArea>
                <div className="flex flex-col p-2">
                  {hours.toReversed().map((hour) => (
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
                          date && date?.getMinutes() === minute
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
              <div className="flex flex-col pb-2">
                <div className="flex flex-1 flex-col p-2">
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
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateInputView;
