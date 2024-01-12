"use client";
import { DatePicker } from "@/components/datepicker/DatePicker";
import React, { useState } from "react";
import RoomCard from "../cards/RoomCard";

const RoomBooking = ({ rooms, clients }: any) => {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <>
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
    </>
  );
};

export default RoomBooking;
