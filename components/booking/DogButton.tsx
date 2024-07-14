"use client";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
interface DogButtonProps {
  dog: {
    _id: string;
    name: string;
  };
  selectedDog: {
    _id: string;
    name: string;
  }[];
  dogsInRooms: {
    dogId: string;
    dogName: string;
    roomId: string;
  }[];
  handleSelectDog: (dog: any) => void;
}

const DogButton = ({
  dog,
  selectedDog,
  dogsInRooms,
  handleSelectDog,
}: DogButtonProps) => {
  return (
    <Button
      key={dog._id}
      className={cn(
        "text-dark200_light900 flex  flex-row items-center gap-2 rounded-lg justify-center px-4 py-2 font-noto_sans font-semibold hover:scale-105 hover:cursor-pointer w-full self-center min-h-[45px] min-w-[150px] border-2 border-green-400",
        { "!bg-dark-600": selectedDog.includes(dog) },
        "dark:!bg-dark-500/50 bg-light-500/30"
      )}
      onClick={() => handleSelectDog(dog)}
      disabled={dogsInRooms.some((item) => item.dogId === dog._id)}
    >
      {dog?.name}
      {dogsInRooms.some((item) => item.dogId === dog._id) ? (
        <Image
          src={"/assets/icons/check2.svg"}
          className="dark:invert"
          alt="check"
          width={25}
          height={25}
        />
      ) : selectedDog.includes(dog) ? (
        <Image
          src={"/assets/icons/upvoted.svg"}
          alt="plus"
          width={20}
          height={20}
        />
      ) : (
        <Image
          src={"/assets/icons/upvote.svg"}
          alt="plus"
          width={20}
          height={20}
        />
      )}
    </Button>
  );
};

export default DogButton;
