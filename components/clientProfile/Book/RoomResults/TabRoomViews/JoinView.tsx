import React from "react";

import PaginatingRooms from "../PaginatingRooms";
import { IconArrowRight, IconUsersGroup } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { ClientProfileProps } from "@/types";
import { SeparateDogTooltip } from "./SeparateDogTooltip";

interface JoinViewProps {
  client: ClientProfileProps;

  handleSelectRoom: Function;
  handleSubmit: Function;
  dogsInRooms: {
    dogId: string;
    dogName: string;
    roomId: string | null;
    roomName: string | null;
  }[];
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

  dogsInRooms,
  availableRooms,
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
  console.log("dogsInRooms", dogsInRooms);

  return (
    <div className="min-h-[50vh] px-4 py-2 font-sans">
      <div className="flex h-full w-full flex-col gap-4">
        <div className="flex w-full flex-row  items-center  ">
          <div className="flex min-w-[180px] flex-col gap-2 rounded-lg bg-gray-100 p-3 text-lg dark:bg-neutral-900">
            {dogsInRooms.map((dog: any) => (
              <div
                key={dog.dogId}
                className="flex w-full flex-row  items-center justify-between  text-gray-800 dark:text-gray-300"
              >
                <span className="min-w-[7vw]"> {dog.dogName}</span>

                <IconArrowRight
                  size={18}
                  className="min-w-[5vw] text-yellow-500"
                />
                <span className="min-w-[5vw]">{dog.roomName}</span>
              </div>
            ))}
          </div>
        </div>

        <div className=" flex min-h-[53vh] w-full flex-col items-center justify-between gap-3 ">
          <div className=" flex w-full  justify-center rounded-lg bg-neutral-900 p-4 text-center text-lg">
            Επιλογη Δωματίων
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
          <div className="ml-4 flex flex-col items-center gap-4">
            <PaginatingRooms
              handleNextPage={handleNextPage}
              handlePreviousPage={handlePreviousPage}
              currentPage={currentPage + 1}
              totalPages={totalPages}
            />
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
