"use client";
import React, { Suspense } from "react";

import Pagination from "../shared/Pagination";
import RoomCard from "../shared/cards/RoomCard";

import CreateBook from "./CreateBook";

import { usePathname } from "next/navigation";
import Filter from "../shared/Filter";
import SearchBar from "../shared/searchBar/SearchBar";
import DogButton from "./DogButton";
import LoadingSkeleton from "../shared/LoadingSkeleton";

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
    <Suspense
      fallback={<LoadingSkeleton size={200} animation="animate-spin mx-auto" />}
    >
      <section className="recent-expenses text-dark400_light500 bg-light-700 font-noto_sans dark:bg-dark-200">
        <header className=" mx-2 flex items-center justify-between rounded-lg bg-light-900  p-2 dark:bg-dark-400">
          <div className="ml-4 flex flex-row items-center gap-4 ">
            <SearchBar
              otherClasses="max-w-[180px] focus-within:border-2 dark:border-light-500 border-slate-300 dark:text-light-900"
              imgSrc="/assets/icons/search.svg"
              iconPosition="left"
              placeholder="Αναζήτηση..."
              route={pathname}
            />
            <Filter
              containerClasses="min-w-[145px] "
              filters={[
                { name: "Όλα", value: "all" },
                { name: "Κατειλημμένο", value: "full" },
                { name: "Διαθέσιμο", value: "empty" },
              ]}
            />
          </div>
          <div className=" flex flex-row  items-center gap-2 p-1 ">
            {client?.dog.map((dog: any) => (
              <DogButton
                key={dog._id}
                dog={dog}
                selectedDog={selectedDog}
                dogsInRooms={dogsInRooms}
                handleSelectDog={handleSelectDog(dog)}
              />
            ))}
            <CreateBook
              dogsInRooms={dogsInRooms}
              setDogsInRooms={setDogsInRooms}
              client={client}
            />
          </div>
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
    </Suspense>
  );
};

export default AvailableRooms;
