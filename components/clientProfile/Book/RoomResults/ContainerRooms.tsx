import React from "react";
import BookingSearchFilter from "./BookingSearchFilter";
import RoomRow from "./RoomRow";

interface ContainerRoomProps {
  rooms: any;
  pageNumber: number;
  isNext: boolean;
  freeCapacityPercentage: string | undefined;
}
const ContainerRooms = ({
  rooms,
  pageNumber,
  isNext,
  freeCapacityPercentage,
}: ContainerRoomProps) => {
  return (
    <section className="text-dark400_light500  mr-4  flex h-full min-h-[70vh] w-full flex-col items-center overflow-x-hidden   rounded-lg border border-neutral-400 bg-light-900 px-1  dark:bg-neutral-950">
      <BookingSearchFilter
        freeCapacityPercentage={freeCapacityPercentage}
        pageNumber={pageNumber}
        isNext={isNext}
      />
      {rooms.length === 0 ? (
        <div className="my-auto flex h-full w-full animate-pulse items-center justify-center text-xl dark:text-yellow-500">
          ΕΠΕΛΕΞΕ ΗΜΕΡΟΜΗΝΙΕΣ
        </div>
      ) : (
        <div className="flex w-full flex-col  gap-2 px-8 py-9">
          {rooms.map((room: any) => (
            <RoomRow key={room._id} room={JSON.parse(JSON.stringify(room))} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ContainerRooms;
