"use client";
import React, { useCallback } from "react";
import { Button } from "../ui/button";
import { cn, formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { BedType } from "./Bed";

interface DogButtonProps {
  dog: any;
  bedName: string;
  roomName: string;
  setBed: React.Dispatch<React.SetStateAction<BedType>>;
  bed: BedType;
  roomId: string;
}

const DogButton = ({
  dog,
  bedName,
  roomName,
  setBed,
  bed,
  roomId,
}: DogButtonProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAddDogToBed = useCallback(() => {
    if (!searchParams.has(dog._id)) {
      const cleanRoomName = roomName.trim().replace(/\s+/g, "");
      const cleanRoomId = roomId.trim().replace(/\s+/g, "");
      setBed((prevBed) => ({
        ...prevBed,
        pending: {
          dogName: dog.name,
          bedName,
          roomName,
          dogId: dog._id,
        },
      }));
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: dog._id,
        value: `${cleanRoomName}_${cleanRoomId}`,
      });
      router.push(newUrl, { scroll: false });
      // Call the onAssign callback
    }
  }, [
    dog._id,
    dog.name,
    roomName,
    bedName,
    setBed,
    searchParams,
    router,
    roomId,
  ]);

  return (
    <Button
      key={dog._id}
      className={cn(
        "text-dark200_light900 flex flex-row items-center gap-2 rounded-lg justify-center px-4 py-2 font-sans font-semibold hover:scale-105 hover:cursor-pointer w-full self-center min-h-[45px] min-w-[150px] border-2 border-green-400",
        "dark:!bg-dark-500/50 bg-light-500/30"
        // Apply styles when disabled
      )}
      onClick={handleAddDogToBed}
    >
      {dog?.name}
    </Button>
  );
};

export default DogButton;
