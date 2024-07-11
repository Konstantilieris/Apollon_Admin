"use client";
import React from "react";
import Image from "next/image";

import Pagination from "../shared/Pagination";
import RoomCard from "../shared/cards/RoomCard";
import { cn } from "@/lib/utils";
import CreateBook from "./CreateBook";
import { Button } from "../ui/button";

import { usePathname } from "next/navigation";
import Filter from "../shared/Filter";
import SearchBar from "../shared/searchBar/SearchBar";

type DogInRoom = {
  dogId: string;
  dogName: string;
  roomId: string;
};
const AvailableRooms = ({ rooms, client, isNext, pageNumber }: any) => {
  const [dogsInRooms, setDogsInRooms] = React.useState<DogInRoom[]>([]);
  const [selectedDog, setSelectedDog] = React.useState<any>([]);

  const pathname = usePathname();
  const handleSelectDog = (dog: any) => () => {
    if (
      selectedDog.includes(dog) ||
      dogsInRooms.some((item) => item.dogId === dog._id)
    ) {
      setSelectedDog(selectedDog.filter((item: any) => item !== dog));
    } else {
      setSelectedDog([...selectedDog, dog]);
    }
  };

  return (
    <section className="recent-expenses text-dark400_light500 bg-light-700 font-noto_sans dark:bg-dark-200">
      <header className=" mx-2 flex items-center justify-between rounded-lg bg-light-900 p-1 dark:bg-dark-400">
        <h2 className="text-light850_dark500 ml-2 flex max-h-[40px] min-h-[36px] flex-row  items-center  gap-2  rounded-lg bg-light-700 p-2 font-semibold dark:bg-dark-300">
          <Image
            src={"/assets/icons/room.svg"}
            alt="room"
            width={30}
            height={30}
          />{" "}
          Δωμάτια
        </h2>
        <SearchBar
          otherClasses="max-w-[180px] focus-within:border-2 dark:border-light-500 border-slate-300 dark:text-light-900"
          imgSrc="/assets/icons/search.svg"
          iconPosition="left"
          placeholder="Αναζήτηση..."
          route={pathname}
        />
        <Filter
          filters={[
            { name: "Όλα", value: "all" },
            { name: "Κατειλημμένο", value: "full" },
            { name: "Διαθέσιμο", value: "empty" },
          ]}
        />

        <div className="flex flex-col gap-1 ">
          {client?.dog.map((dog: any) => (
            <Button
              key={dog._id}
              className={cn(
                "text-dark200_light900 flex  flex-row items-center gap-2 rounded-xl justify-center px-4 py-2 font-noto_sans font-semibold hover:scale-105 hover:cursor-pointer w-full self-center",
                { "!bg-dark-600": selectedDog.includes(dog) },
                "dark:!bg-dark-500/50 bg-light-500/30"
              )}
              onClick={handleSelectDog(dog)}
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
          ))}
        </div>

        <CreateBook
          dogsInRooms={dogsInRooms}
          setDogsInRooms={setDogsInRooms}
          client={client}
        />
      </header>
      <div className="mb-20 flex w-full flex-col items-center justify-center gap-2 px-8 py-4">
        {rooms.map((room: any) => (
          <RoomCard
            room={room}
            client={client}
            key={room._id}
            selectedDog={selectedDog}
            setSelectedDog={setSelectedDog}
            dogsInRooms={dogsInRooms}
            setDogsInRooms={setDogsInRooms}
          />
        ))}

        <Pagination pageNumber={pageNumber} isNext={isNext} />
      </div>
    </section>
  );
};

export default AvailableRooms;
