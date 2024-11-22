/* eslint-disable no-unused-vars */
"use client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/reshapedCalendar";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface Props {
  field: any;
  maxwidth?: string;
  color?: string;
}

export function DateInput({ field, maxwidth, color }: Props) {
  const [stringDate, setStringDate] = React.useState<string>(
    field.value ? format(new Date(field.value), "dd/MM/yyyy") : ""
  );
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const handleDateChange = (input: string) => {
    const trimmedInput = input.trim(); // Trim whitespace
    setStringDate(trimmedInput);

    // Regular expression to validate the format dd/MM/yyyy
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    if (!datePattern.test(trimmedInput)) {
      setErrorMessage("Invalid Date Format");
      field.onChange(""); // Clear the field if the format is incorrect
      return;
    }

    const [day, month, year] = trimmedInput.split("/");

    // Ensure the date parts are valid before creating a new Date object
    const isValidDate = day && month && year;
    const parsedDate = isValidDate
      ? new Date(`${year}-${month}-${day}`)
      : new Date(NaN);

    if (isNaN(parsedDate.getTime())) {
      setErrorMessage("Invalid Date");
      field.onChange(""); // Clear the field on invalid date
    } else {
      setErrorMessage("");
      field.onChange(parsedDate); // Pass the valid date to the field
    }
  };

  return (
    <Popover>
      <div className={cn("relative form-input", maxwidth)}>
        <Input
          className={cn(
            "background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 form_input max-w-[400px]  ",
            color
          )}
          type="string"
          value={stringDate}
          onChange={(e) => handleDateChange(e.target.value)}
        />
        {errorMessage !== "" && (
          <div className="absolute bottom-[-1.75rem] left-0 text-sm text-red-400">
            {errorMessage}
          </div>
        )}
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "font-normal absolute right-0 translate-y-[-50%] top-[50%] border-none mr-2",
              !field.value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4 dark:invert-0 " />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="background-light900_dark300 text-dark300_light700 absolute right-[25px] top-0 w-auto p-0 ">
        <Calendar
          className="rounded-md border font-sans shadow"
          mode="single"
          selected={field.value}
          disabled={(date) => date < new Date("1900-01-01")}
          onSelect={(selectedDate) => {
            if (!selectedDate) return;

            field.onChange(selectedDate);
            setStringDate(format(selectedDate, "dd/MM/yyyy"));
            setErrorMessage("");
          }}
          defaultMonth={field.value}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
