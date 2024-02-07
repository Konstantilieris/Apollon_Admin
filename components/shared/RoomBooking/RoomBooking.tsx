"use client";
import { DatePicker } from "@/components/datepicker/DatePicker";
import React, { Suspense, useState } from "react";
import RoomCard from "../cards/RoomCard";
import LoadingSkeleton from "../LoadingSkeleton";

const RoomBooking = ({ rooms, clients }: any) => {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <>
      <Suspense
        fallback={<LoadingSkeleton size={12} animation="animate-spin" />}
      >
        <DatePicker date={date} setDate={setDate} />
        <div className="mt-4 grid grid-cols-6 gap-4">
          {rooms.map((room: any) => {
            return (
              <RoomCard
                room={room}
                date={date}
                key={room._id}
                clients={clients}
              />
            );
          })}
        </div>
      </Suspense>
    </>
  );
};

export default RoomBooking;
