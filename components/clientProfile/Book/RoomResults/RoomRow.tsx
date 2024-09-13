"use client";
import React from "react";
import { IconHomeShield, IconArrowBigRightLines } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { BookingCard } from "./BookingCard";

const RoomRow = ({ room }: any) => {
  return (
    <div className="flex max-h-[16vh] min-h-[15vh] flex-row rounded-lg bg-neutral-900 ">
      <div className="relative m-2 flex w-1/6 flex-row items-center justify-center rounded-lg bg-neutral-800 p-4 text-light-700">
        <IconHomeShield
          size={40}
          className={cn("absolute left-2 top-2 ", {
            "text-red-500": room.currentBookings.length > 0,
            "text-green-500": room.currentBookings.length === 0,
          })}
        />
        <h3 className="font-sans text-lg font-semibold">{room?.name}</h3>
      </div>
      <div className="ml-8 flex w-2/3 flex-row gap-2 py-2">
        {room.currentBookings.length > 0 && (
          <IconArrowBigRightLines
            size={70}
            className="mr-12 self-center text-yellow-600"
          />
        )}
        {room.currentBookings.map((booking: any) => (
          <BookingCard
            key={booking.bookingId}
            booking={JSON.parse(JSON.stringify(booking))}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomRow;
