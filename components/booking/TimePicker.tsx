"use client";
import React, { useState } from "react";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { format, setHours, setMinutes } from "date-fns";
import "./Scrollbar.css";

const TimePicker = ({
  setTime,
  time,
}: {
  setTime: React.Dispatch<React.SetStateAction<Date | null>>;
  time: Date | null;
}) => {
  const [selectedTime, setSelectedTime] = useState<Date>(time || new Date());

  const handleTimeChange = (hours: number, minutes: number) => {
    const newTime = setMinutes(setHours(selectedTime, hours), minutes);
    setSelectedTime(newTime);
    setTime(newTime);
  };

  const hoursArray = Array.from({ length: 16 }, (_, i) =>
    String(8 + i).padStart(2, "0")
  );
  const minutesArray = Array.from({ length: 12 }, (_, i) =>
    String(i * 5).padStart(2, "0")
  );
  return (
    <div className="flex flex-row gap-1 font-noto_sans">
      {" "}
      <div className="flex flex-col">
        <ScrollArea className="scrollbar-custom background-light900_dark200 h-[160px] w-12 rounded-md border font-noto_sans hover:overflow-y-scroll ">
          <div className="mt-2 flex flex-col items-center justify-center ">
            {hoursArray.map((hour) => (
              <React.Fragment key={hour}>
                <div
                  onClick={() =>
                    handleTimeChange(+hour, selectedTime.getMinutes())
                  }
                  className={`cursor-pointer rounded-md p-2 text-sm ${
                    selectedTime.getHours() === +hour
                      ? "bg-orange-700"
                      : "hover:bg-orange-600"
                  }`}
                >
                  {format(new Date().setHours(+hour), "HH")}
                </div>
                <Separator className="my-2" />
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="flex flex-col">
        <ScrollArea className="scrollbar-custom background-light900_dark200 h-[160px] w-12 rounded-md border font-noto_sans hover:overflow-y-scroll ">
          <div className="mt-2 flex flex-col items-center justify-center ">
            {minutesArray.map((minute) => (
              <React.Fragment key={minute}>
                <div
                  onClick={() =>
                    handleTimeChange(selectedTime.getHours(), +minute)
                  }
                  className={`cursor-pointer rounded-md p-2 text-sm ${
                    selectedTime.getMinutes() === +minute
                      ? "bg-orange-700"
                      : "hover:bg-orange-600"
                  }`}
                >
                  {format(new Date().setMinutes(+minute), "mm")}
                </div>
                <Separator className="my-2" />
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TimePicker;
