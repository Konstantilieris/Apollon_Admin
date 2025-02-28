import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import moment from "moment";
import "moment/locale/el";
import { cn } from "@/lib/utils";

const generateTimeOptions = (start: any, end: any, interval: any) => {
  const times = [];
  let currentTime = start;

  while (currentTime <= end) {
    const hours = Math.floor(currentTime / 60);
    const minutes = currentTime % 60;
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    times.push(formattedTime);
    currentTime += interval;
  }

  return times;
};

const TimeSelect = ({
  placeHolderText,
  date,
  setDate,
  className = "",
}: any) => {
  const times = generateTimeOptions(420, 1380, 30); // 07:00 (420 minutes) to 23:00 (1380 minutes) with 30-minute intervals
  // extract the time from the date with moment and set it to the selected time

  const [selectedTime, setSelectedTime] = React.useState<string | undefined>(
    date ? moment(date).format("HH:mm") : undefined
  );

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);

    // Parse the selected time with Moment.js
    const [hours, minutes] = time.split(":").map(Number);
    const newDate = moment(date).hours(hours).minutes(minutes);
    setDate(newDate.toDate());
  };

  return (
    <div className="mt-2 flex flex-col space-y-2 pl-4">
      <Select value={selectedTime} onValueChange={handleTimeChange}>
        <SelectTrigger
          className={cn(
            "h-[60px] w-[300px] bg-neutral-900 font-sans text-lg",
            className
          )}
        >
          <SelectValue placeholder={placeHolderText} />
        </SelectTrigger>
        <SelectContent className="w-full bg-neutral-900 font-sans text-lg">
          <SelectGroup className="text-center">
            {times.map((time) => (
              <SelectItem
                key={time}
                value={time}
                className=" w-full  text-center text-lg hover:scale-105 hover:bg-light-500"
              >
                {time}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <span className="ml-4  text-light-700">
        {date ? moment(date).locale("el").format("DD/MM/YYYY-HH:mm") : ""}
      </span>
    </div>
  );
};

export default TimeSelect;
