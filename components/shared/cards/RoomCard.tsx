"use client";
import React from "react";
import Image from "next/image";

import { formatDate, formatDateString2, intToDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
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
      setDogsInRooms([
        ...dogsInRooms,
        ...selectedDog.map((dog: any) => {
          return {
            dogId: dog._id,
            dogName: dog.name,
            roomId: room._id,
            roomName: room.name,
          };
        }),
      ]);
      setSelectedDog([]);
    }
  };
  const removeDogFromRoom = () => {
    setDogsInRooms(dogsInRooms.filter((dog: any) => dog.roomId !== room._id));
  };
  const searchParams = useSearchParams();

  return (
    <div className=" text-dark200_light800 relative   flex  min-h-[140px]  w-full flex-col rounded-lg bg-light-800 p-8 font-inter dark:bg-dark-400 lg:max-w-[800px] 2xl:max-w-[1000px]">
      <h1 className="absolute left-0 top-0 ml-2 mt-2 flex flex-row items-center gap-2 rounded-full bg-slate-200 px-4 py-2 font-inter text-lg font-bold dark:bg-slate-700">
        <Image
          width={30}
          height={30}
          src={"/assets/icons/room.svg"}
          alt={room.name}
        />
        {room.name}
      </h1>{" "}
      <div className="absolute right-0 top-0 mr-2 mt-2 flex flex-row">
        <Button onClick={AddDogToRoom}>
          <Image
            width={30}
            height={30}
            src={"/assets/icons/plus.svg"}
            alt="add"
            className=" hover:animate-pulse hover:cursor-pointer dark:invert"
          />
        </Button>
        {dogsInRooms.length > 0 &&
          dogsInRooms.some((dog: any) => dog.roomId === room._id) && (
            <Button onClick={removeDogFromRoom}>
              <Image
                width={30}
                height={30}
                src={"/assets/icons/trash.svg"}
                alt="check"
                className=" hover:animate-pulse hover:cursor-pointer "
              />
            </Button>
          )}
      </div>
      {/* Adjusted margin-top to make space for the header */}
      <div className=" mt-12 flex w-full flex-row flex-wrap gap-2">
        {room.currentBookings.length > 0 ? (
          <div className="flex flex-row  gap-2">
            {room?.currentBookings.map(
              (booking: any) =>
                booking?.dogs?.map((dog: any) => (
                  <Badge
                    key={dog._id}
                    className="rounded-full bg-purple-200 p-2 dark:bg-purple-700"
                  >
                    {dog?.dogName}-Μέχρι{" "}
                    {formatDate(new Date(booking?.toDate), "el")}
                  </Badge>
                ))
            )}
            {dogsInRooms.map(
              (item: any) =>
                item.roomId === room._id && (
                  <Badge
                    key={item.dogId}
                    className="rounded-full bg-purple-200 p-2 dark:bg-purple-700"
                  >
                    {item.dogName}
                  </Badge>
                )
            )}
          </div>
        ) : (
          <div className="mx-auto flex flex-row gap-2 p-2 ">
            <h2 className="flex flex-row items-center gap-2 text-xl font-medium ">
              <span>Διαθέσιμο</span>{" "}
              {searchParams.get("fr") && searchParams.get("to") && (
                <span>
                  {formatDateString2(intToDate(+searchParams.get("fr")!))} -{" "}
                  {formatDateString2(intToDate(+searchParams.get("to")!))}
                </span>
              )}
              <Image
                className={`hover:animate-pulse hover:cursor-pointer dark:invert`}
                width={30}
                height={30}
                src={"/assets/icons/empty.svg"}
                alt="empty"
              />
            </h2>
            {dogsInRooms.map(
              (item: any) =>
                item.roomId === room._id && (
                  <Badge
                    key={item.dogId}
                    className="rounded-full bg-light-500/50 p-3 dark:bg-dark-500/70 "
                  >
                    {item.dogName}
                  </Badge>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
