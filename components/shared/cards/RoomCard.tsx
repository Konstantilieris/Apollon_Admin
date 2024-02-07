"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";

import { addDays } from "date-fns";

import RoomDrawer from "../RoomDrawer";
import { isRoomAvailable } from "@/lib/utils";

const RoomCard = ({ room, date, clients }: any) => {
  const [availability, setAvailability] = useState<Boolean | undefined>(false);
  const [open, setOpen] = useState(false);
  const [rangeDate, setRangeDate] = useState<DateRange>({
    from: date,
    to: addDays(date, 1),
  });
  useEffect(() => {
    if (date) {
      setRangeDate({
        from: date,
        to: addDays(date, 1),
      });
    } else {
      setRangeDate({
        from: new Date(),
        to: addDays(new Date(), 1),
      });
    }
    const dateAvailable = isRoomAvailable(room.unavailableDates, [
      date.toISOString().split("T")[0],
    ]);
    setAvailability(dateAvailable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);
  const handleOpenDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="card-wrapper text-dark200_light800 flex max-h-[140px] w-full max-w-[200px] flex-col rounded-lg p-4 font-noto_sans max-xs:min-w-full xs:w-[260px]">
        <div className="flex flex-row justify-between">
          <h1 className="ml-2 font-noto_sans text-lg font-bold">{room.name}</h1>
          <Badge
            className={`max-h-[30px] min-h-[30px] font-noto_sans font-bold ${
              availability ? "bg-celtic-green text-white" : ""
            }`}
            variant={availability ? "outline" : "destructive"}
          >
            {availability ? "Διαθέσιμο" : "Μη Διαθέσιμο"}
          </Badge>
        </div>
        <div className="self-center">
          <Image
            onClick={availability ? handleOpenDrawer : () => {}}
            className={`hover:animate-pulse hover:cursor-pointer ${
              availability ? "" : "mt-2"
            }`}
            width={availability ? 90 : 70}
            height={90}
            src={
              availability
                ? "/assets/icons/room-available.svg"
                : "/assets/icons/room-unavailable.svg"
            }
            alt={room.name}
          />
        </div>
      </div>
      <RoomDrawer
        room={room}
        open={open}
        setOpen={setOpen}
        clients={clients}
        rangeDate={rangeDate}
      />
    </>
  );
};

export default RoomCard;
