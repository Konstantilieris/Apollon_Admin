import React from "react";

import PaginatingRooms from "../PaginatingRooms";
import {
  IconArrowRight,
  IconUsersGroup,
  IconHomeFilled,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { ClientProfileProps } from "@/types";
import { SeparateDogTooltip } from "./SeparateDogTooltip";

interface JoinViewProps {
  client: ClientProfileProps;
  setStages: (stages: number) => void;
  handleSelectRoom: Function;
  handleSubmit: Function;
  dogsInRooms: {
    dogId: string;
    dogName: string;
    roomId: string | null;
    roomName: string | null;
  }[];
  freeCapacityPercentage: number;
  availableRooms: {
    name: string;
    _id: string;
    currentBookings: any[];
  }[];
}

const JoinView = ({
  client,
  handleSubmit,
  handleSelectRoom,
  freeCapacityPercentage = 0,
  dogsInRooms,
  availableRooms,
  setStages,
}: JoinViewProps) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const roomsPerPage = 5;
  const totalPages = Math.ceil(availableRooms.length / roomsPerPage);
  const roomsToDisplay = availableRooms.slice(
    currentPage * roomsPerPage,
    (currentPage + 1) * roomsPerPage
  );
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="absolute inset-0  flex flex-col justify-between p-2">
      <div className="flex h-full w-full flex-col gap-4">
        <div className=" flex w-full flex-col items-center justify-between gap-3 ">
          <div className="relative flex w-full items-center justify-between rounded-lg bg-neutral-950 p-4 py-6  text-center text-lg">
            <IconHomeFilled size={35} className="text-yellow-500" />
            <span className="mx-auto ml-[8vw] w-full justify-self-center tracking-widest">
              ΕΠΙΛΟΓΗ ΔΩΜΑΤΙΩΝ
            </span>
            <div
              className={cn(
                " flex gap-2 rounded-lg bg-neutral-800 px-4 py-2 font-semibold  ",
                freeCapacityPercentage &&
                  freeCapacityPercentage < 20 &&
                  "text-red-500",
                freeCapacityPercentage &&
                  freeCapacityPercentage >= 20 &&
                  freeCapacityPercentage < 50 &&
                  "text-yellow-500",
                freeCapacityPercentage &&
                  freeCapacityPercentage >= 50 &&
                  "text-green-500",
                !freeCapacityPercentage && "text-yellow-500"
              )}
            >
              <span>ΔΙΑΘΕΣΙΜΟΤΗΤΑ: </span>
              {freeCapacityPercentage ?? 0}
              <span>%</span>
            </div>
          </div>
          <div className="flex w-full flex-row  justify-center ">
            <div className="flex  min-w-[30vw] flex-col justify-evenly gap-2 rounded-lg bg-gray-100 p-3 text-lg dark:bg-neutral-950">
              {dogsInRooms.map((dog: any) => (
                <div
                  key={dog.dogId}
                  className="mx-4 flex w-full  flex-row items-center  justify-between py-2 text-gray-800 dark:text-gray-300"
                >
                  <span className=""> {dog.dogName}</span>

                  <IconArrowRight
                    size={24}
                    className="ml-14 min-w-[5vw] text-yellow-500"
                  />
                  <span className="min-w-[5vw] text-center">
                    {dog.roomName}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {roomsToDisplay.map((room: any) => (
            <div
              key={room._id}
              className="flex max-h-[6vh] min-h-[5vh] min-w-[30vw] cursor-pointer flex-row items-center justify-between gap-2 self-center rounded-lg bg-neutral-900 p-4 px-12 text-sm text-gray-700 hover:scale-110 dark:text-gray-300"
            >
              <span className=" min-w-[3.2vw]  text-lg">{room.name}</span>
              <span className=" flex  min-w-[4vw] flex-row items-center gap-2">
                {
                  <SeparateDogTooltip
                    dogs={client.dog}
                    handleSelectRoom={handleSelectRoom}
                    room={room}
                    dogsInRooms={dogsInRooms}
                  />
                }
              </span>

              <IconUsersGroup
                size={35}
                className={cn("text-yellow-600", {
                  "text-green-500": dogsInRooms.every(
                    (dog) => dog.roomId === room._id
                  ),
                })}
                onClick={handleSelectRoom(room, "Join")}
              />
            </div>
          ))}
          <div className="mr-3">
            <PaginatingRooms
              handleNextPage={handleNextPage}
              handlePreviousPage={handlePreviousPage}
              currentPage={currentPage + 1}
              totalPages={totalPages}
            />
          </div>
          <div className="flex min-w-[30vw] items-center justify-center gap-4 self-center">
            <button
              onClick={() => setStages(0)}
              className=" min-w-[140px] rounded-lg border border-black bg-transparent px-6 py-2 font-bold tracking-widest text-black shadow-[0_0_0_3px_#000000_inset] transition duration-200 hover:-translate-y-1 dark:border-white dark:text-red-500"
            >
              ΠΙΣΩ
            </button>
            <button
              className=" rounded-lg border border-black bg-transparent px-6 py-2 font-bold text-black shadow-[0_0_0_3px_#000000_inset] transition duration-200 hover:-translate-y-1 dark:border-white dark:text-yellow-500"
              disabled={dogsInRooms.every((dog) => !dog.roomId)}
              onClick={() => handleSubmit()}
            >
              ΚΑΤΑΧΩΡΗΣΗ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinView;
