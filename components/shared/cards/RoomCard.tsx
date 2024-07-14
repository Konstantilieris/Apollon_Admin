"use client";
import React from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn, getDayAndMonth } from "@/lib/utils";
type Bed = {
  name: string;
  occupied: boolean;
  pending?: {
    dogId: string;
    dogName: string;
  } | null;
  data: any;
};
const RoomCard = ({
  room,
  client,
  selectedDog,
  setSelectedDog,
  dogsInRooms,
  setDogsInRooms,
}: any) => {
  const AddDogToRoom = () => {
    if (selectedDog.length > 0) {
      const updatedBeds = [...beds];
      let addedToBed = false;

      for (let i = 0; i < updatedBeds.length; i++) {
        if (!updatedBeds[i].occupied) {
          updatedBeds[i].pending = {
            dogId: selectedDog[0]._id,
            dogName: selectedDog[0].name,
          };
          addedToBed = true;
          break;
        }
      }

      if (addedToBed) {
        setBeds(updatedBeds);

        setDogsInRooms([
          ...dogsInRooms,
          {
            dogId: selectedDog[0]._id,
            dogName: selectedDog[0].name,
            roomId: room._id,
            roomName: room.name,
            bedIndex: updatedBeds.findIndex((bed) => bed.pending !== null),
          },
        ]);

        setSelectedDog(selectedDog.slice(1));
      }
    }
  };

  const removeDogFromRoom = () => {
    const updatedBeds = beds.map((bed) => ({
      ...bed,
      pending: null,
    }));
    setBeds(updatedBeds);

    setDogsInRooms(dogsInRooms.filter((dog: any) => dog.roomId !== room._id));
  };

  const allDogs = room.currentBookings.flatMap((booking: any) =>
    booking.dogs.map((dog: any) => ({
      ...dog,
      fromDate: booking.fromDate,
      toDate: booking.toDate,
      clientName: booking?.clientId.name,
    }))
  );
  const [beds, setBeds] = React.useState<Bed[]>(
    Array.from({ length: 4 }).map((_, i) => {
      return {
        name: `Bed ${i + 1}`,
        occupied: !!allDogs[i],

        data: allDogs[i] ? allDogs[i] : {},
      };
    })
  );
  const roomStatus = beds.every((bed) => bed.occupied) ? "Full" : "Available";

  return (
    <div
      className={cn(
        "text-dark200_light800 relative flex h-full min-h-[140px] w-full items-end justify-center rounded-lg bg-light-800 p-8 font-inter dark:bg-dark-400 lg:max-w-[800px] 2xl:max-w-[1000px]",
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
      <div className="background-light900_dark200 absolute right-0 top-2 mr-2 flex flex-row rounded-lg">
        <Button
          onClick={AddDogToRoom}
          className=" hover:scale-125 "
          disabled={selectedDog <= 0}
        >
          <Image
            width={34}
            height={30}
            src={"/assets/icons/plus.svg"}
            alt="check"
            className=" dark:invert"
          />
        </Button>

        <Button
          onClick={removeDogFromRoom}
          disabled={
            dogsInRooms.length <= 0 ||
            !dogsInRooms.some((dog: any) => dog.roomId === room._id)
          }
        >
          <Image
            width={30}
            height={30}
            src={"/assets/icons/delete.svg"}
            alt="check"
            className=" hover:animate-pulse hover:cursor-pointer "
          />
        </Button>
      </div>
      {/* Adjusted margin-top to make space for the header */}
      <div className="grid h-full w-full grid-cols-4 gap-4 p-4">
        {beds.map((bed, index) => (
          <div
            key={index}
            className={cn(
              "flex h-32 w-full flex-col items-center justify-center p-2 text-start font-noto_sans text-white bg-slate-500",
              { "bg-red-800": bed.occupied },
              { "bg-blue-700": bed.pending }
            )}
          >
            {bed.occupied ? (
              <div className="flex w-full flex-col  items-start gap-2 p-2 font-noto_sans">
                <span className=" flex  w-full  gap-2 text-lg">
                  <Image
                    src={"/assets/icons/noclient.svg"}
                    alt="dog"
                    width={30}
                    height={30}
                  />
                  {bed?.data?.clientName}
                </span>
                <span className=" flex  w-full  gap-2 text-lg">
                  <Image
                    src={"/assets/icons/dog.svg"}
                    alt="dog"
                    width={30}
                    height={30}
                  />
                  {bed?.data?.dogName}
                </span>

                <span className=" ml-1 flex gap-2">
                  <Image
                    src={"/assets/icons/calendar.svg"}
                    alt="calendar"
                    width={23}
                    height={23}
                    className="mb-1 invert max-lg:hidden"
                  />
                  {getDayAndMonth(new Date(bed.data?.fromDate))} -{" "}
                  {getDayAndMonth(new Date(bed.data?.toDate))}
                </span>
              </div>
            ) : bed.pending ? (
              <p className="line-clamp-3 flex flex-row items-center text-center">
                {" "}
                <Image
                  src={"/assets/icons/dog.svg"}
                  alt="dog"
                  width={30}
                  height={30}
                />
                {bed.pending.dogName}
              </p>
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomCard;
