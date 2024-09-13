"use client";
import { getLastBookingOfClient } from "@/lib/actions/client.action";
import { cn } from "@/lib/utils";
import { IconArrowRight, IconCheck, IconHomeFilled } from "@tabler/icons-react";
import React, { useEffect } from "react";

import { ClientProfileProps } from "@/types";
import JoinView from "./TabRoomViews/JoinView";

interface SelectRoomProps {
  client: ClientProfileProps;
  setRoomPreference: (roomPreference: string) => void;
  availableRooms: {
    name: string;
    _id: string;
    currentBookings: any[];
  }[];
  rangeDate: {
    from: Date;
    to: Date;
  };
  setStages: (stages: number) => void;
  setData: (data: any) => void;
}
const SelectRooms = ({
  client,
  availableRooms,
  rangeDate,
  setStages,
  setData,
  setRoomPreference,
}: SelectRoomProps) => {
  const [, setLoading] = React.useState(false);
  const [quickSuggestion, setQuickSuggestion] = React.useState<any>();

  const [dogsInRooms, setDogsInRooms] = React.useState(
    client.dog.map((dog: any) => ({
      dogId: dog._id,
      dogName: dog.name,
      roomId: null,
      roomName: null,
    }))
  );

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await getLastBookingOfClient({
          clientId: client._id,
          rangeDate,
        });

        if (res) {
          setQuickSuggestion(res);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  const handleSelectRoom = (room: any, type: string, dogId?: string) => () => {
    if (type === "Join") {
      // Create a new array where we immutably update dogsInRooms
      const updatedDogsInRooms = dogsInRooms.map((dogInRoom: any) => {
        if (dogInRoom.roomId === room._id) {
          // If the dog is already in the selected room, remove it
          return {
            ...dogInRoom,
            roomId: null,
            roomName: null,
          };
        } else {
          // Otherwise, place the dog in the selected room
          return {
            ...dogInRoom,
            roomId: room._id,
            roomName: room.name,
          };
        }
      });

      // Update state with the new array
      setDogsInRooms(updatedDogsInRooms);

      // Set the selected room or clear it if already selected
    } else {
      const updatedDogsInRooms = dogsInRooms.map((dogInRoom: any) => {
        if (dogInRoom.dogId === dogId) {
          if (dogInRoom.roomId === room._id) {
            // If the dog is already in the selected room, remove it
            return {
              ...dogInRoom,
              roomId: null,
              roomName: null,
            };
          } else {
            // Otherwise, place the dog in the selected room
            return {
              ...dogInRoom,
              roomId: room._id,
              roomName: room.name,
            };
          }
        }
        return dogInRoom;
      });
      setDogsInRooms(updatedDogsInRooms);
    }
  };
  const handleSubmit = () => {
    setRoomPreference(
      dogsInRooms.every((dog) => dogsInRooms[0].roomId === dog.roomId)
        ? "Join"
        : "Separate"
    );
    setData(dogsInRooms);
    setStages(1);
  };
  const renderQuickSuggestion = () => {
    if (!quickSuggestion) return null;

    const suggestionType =
      quickSuggestion?.type === "Join" ? "ΜΑΖΙ" : "ΔΙΑΧΩΡΙΣΜΕΝΑ";

    return (
      <div className="mt-4 flex w-full items-center gap-4 rounded-lg bg-gray-100 p-4 dark:bg-neutral-800">
        <span className="flex flex-row items-center text-lg font-medium text-gray-800 dark:text-gray-200">
          Γρήγορη πρόταση από την τελευταία κράτηση: {suggestionType}{" "}
          <IconArrowRight size={24} />
        </span>

        {quickSuggestion?.type === "Join" ? (
          <button
            className={cn(
              "min-w-[140px] min-h-[40px] flex items-center justify-center gap-2 rounded-md bg-black px-8 py-2 text-sm font-semibold text-white hover:bg-black/[0.8] hover:shadow-lg",
              { "bg-red-600": quickSuggestion.rooms.availability }
            )}
            disabled={quickSuggestion.rooms.availability}
            onClick={() => {
              const room = {
                _id: quickSuggestion?.rooms.roomId,
                name: quickSuggestion?.rooms.roomName,
              };
              handleSelectRoom(room, "Join")();
            }}
          >
            {quickSuggestion?.rooms.roomName}
            {dogsInRooms.find(
              (room) => room.roomId === quickSuggestion.rooms.roomId
            ) && <IconCheck size={22} className="text-yellow-500" />}
          </button>
        ) : (
          <div className="ml-4 flex flex-col items-center gap-2">
            {quickSuggestion?.rooms.map((room: any) => (
              <div
                key={room.roomId}
                className="flex flex-row items-center gap-4"
              >
                <span className="min-w-[5vw]">{room?.dogName}</span>
                <button
                  className={cn(
                    "min-w-[10vw] flex items-center justify-center gap-2 rounded-md bg-black px-8 py-2 text-sm font-semibold text-white hover:bg-black/[0.8] hover:shadow-lg"
                  )}
                  onClick={() => {
                    const newRoom: any = {
                      _id: room.roomId,
                      name: room.roomName,
                    };
                    handleSelectRoom(newRoom, "Separate", room.dogId)();
                  }}
                >
                  {room?.roomName}
                  {dogsInRooms.find((dog) => dog.roomId === room.roomId) && (
                    <IconCheck size={22} className="text-yellow-500" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="relative flex w-full flex-col px-4 max-md:items-start max-md:justify-items-start">
      <IconHomeFilled className="absolute left-0 top-0 h-8 w-8 text-yellow-500 max-md:hidden" />

      <div className=" mt-12 flex w-full  flex-col  text-xl  dark:text-light-800">
        {renderQuickSuggestion()}
      </div>
      <section>
        <JoinView
          client={client}
          availableRooms={availableRooms}
          handleSelectRoom={handleSelectRoom}
          dogsInRooms={dogsInRooms}
        />

        <div className="mt-4 flex w-full flex-row justify-end">
          <button
            className="duration-400 rounded-lg border border-black bg-transparent px-6 py-2 font-bold text-black shadow-[0_0_0_3px_#000000_inset] transition hover:-translate-y-1 dark:border-white dark:text-white"
            disabled={dogsInRooms.every((dog) => !dog.roomId)}
            onClick={handleSubmit}
          >
            ΚΑΤΑΧΩΡΗΣΗ
          </button>
        </div>
      </section>
    </section>
  );
};

export default SelectRooms;
