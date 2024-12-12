"use client";
import React, { useMemo } from "react";

import { getDayAndMonth } from "@/lib/utils";

import { IconUser, IconCalendar, IconDog } from "@tabler/icons-react";

export function BookingCard({ booking }: any) {
  const dateFrom = useMemo(
    () => getDayAndMonth(new Date(booking.fromDate)),
    [booking.fromDate]
  );

  const dateTo = useMemo(
    () => getDayAndMonth(new Date(booking.toDate)),
    [booking.toDate]
  );

  return (
    <section
      key={booking.bookingId}
      className="mr-2 mt-1 flex w-1/6 flex-col   justify-between space-y-2 overflow-hidden  rounded-lg bg-neutral-800 p-4 text-light-700"
    >
      <div className="flex w-full flex-row items-center gap-2 text-lg">
        {" "}
        <IconUser size={30} />
        <span className="w-full truncate">{booking.clientName}</span>
      </div>

      <div className="flex w-full flex-row gap-2 truncate text-lg">
        <IconDog size={30} />
        <span className="w-full truncate">
          {booking.dogs.map((dog: any) => dog.dogName).join(", ")}
        </span>
      </div>
      <div className=" flex flex-row items-center gap-2  text-lg ">
        <IconCalendar size={30} />
        {dateFrom} - {dateTo}
      </div>
    </section>
  );
}
