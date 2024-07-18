"use client";
import { cn, getDayAndMonth, removeKeysFromQuery } from "@/lib/utils";
import React, { useState } from "react";
import Image from "next/image";
import DogButton from "./DogButton";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface BedProps {
  isDog: any;
  name: string;
  clientDogs: any;
  roomName: string;
}
export type BedType = {
  name: string;
  occupied: boolean;
  pending: any;
  data: any;
};
const Bed = ({ isDog, name, clientDogs, roomName }: BedProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bed, setBed] = useState<BedType>({
    name,
    occupied: !!isDog,
    pending: null,
    data: isDog,
  });
  const handleDeleteDogFromBed = () => {
    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: [bed.pending.dogId],
    });
    router.push(newUrl, { scroll: false });
    setBed({
      ...bed,
      pending: null,
    });
  };
  return (
    <div
      className={cn(
        "flex h-32 w-full flex-col items-center justify-center p-2 text-start font-noto_sans text-white bg-slate-500",
        { "bg-red-800": bed.occupied },
        { "bg-blue-700": bed?.pending }
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
        <div className="line-clamp-3 flex flex-row items-center text-center">
          {" "}
          <Image
            src={"/assets/icons/dog.svg"}
            alt="dog"
            width={30}
            height={30}
          />
          {bed?.pending?.dogName}
          <Button onClick={handleDeleteDogFromBed}>
            <Image
              width={30}
              height={30}
              src={"/assets/icons/delete.svg"}
              alt="check"
              className=" hover:animate-pulse hover:cursor-pointer "
            />
          </Button>
        </div>
      ) : (
        <div>
          {clientDogs.map((dog: any) => (
            <DogButton
              dog={dog}
              key={dog._id}
              bedName={name}
              roomName={roomName}
              setBed={setBed}
              bed={bed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bed;
