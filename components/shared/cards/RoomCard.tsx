"use client";
import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

import Bed from "@/components/booking/Bed";

const RoomCard = ({ room, client, searchParams }: any) => {
  const allDogs = room.currentBookings.flatMap((booking: any) =>
    booking.dogs.map((dog: any) => ({
      ...dog,
      fromDate: booking.fromDate,
      toDate: booking.toDate,
      clientName: booking?.clientId.name,
    }))
  );

  const roomStatus = allDogs.length >= 4 ? "Full" : "Available";
  const filteredDogs = client.dog.filter((dog: any) => {
    return !Object.prototype.hasOwnProperty.call(searchParams, dog._id);
  });

  return (
    <div
      className={cn(
        "text-dark200_light800 relative flex h-full min-h-[140px]  items-end justify-center rounded-lg bg-light-800 p-8 font-inter dark:bg-dark-400 w-full",
        { "bg-red-950 dark:bg-red-950": roomStatus === "Full" }
      )}
    >
      <h1 className="absolute left-0 top-0 ml-2 mt-2 flex flex-row items-center gap-2 rounded-full bg-slate-200 px-4 py-2 font-inter text-lg font-bold dark:bg-slate-700">
        <Image
          width={30}
          height={30}
          src={"/assets/icons/residence.svg"}
          alt={room}
          className="mb-2"
        />
        {room.name}
      </h1>{" "}
      {/* Adjusted margin-top to make space for the header */}
      <div className="grid h-full w-full grid-cols-4 gap-4 p-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Bed
            isDog={allDogs[index] ? allDogs[index] : null}
            key={index}
            roomName={room.name}
            name={`${index + 1}`}
            clientDogs={filteredDogs}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomCard;
