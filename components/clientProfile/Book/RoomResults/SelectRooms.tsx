"use client";
import { getLastBookingOfClient } from "@/lib/actions/client.action";
import { cn } from "@/lib/utils";
import { IconArrowRight, IconCheck, IconHomeFilled } from "@tabler/icons-react";
import React, { useCallback, useEffect } from "react";

import { ClientProfileProps } from "@/types";
import JoinView from "./TabRoomViews/JoinView";
import { DateRange } from "react-day-picker";

interface SelectRoomProps {
  client: ClientProfileProps;
  setRoomPreference: (roomPreference: string) => void;
  availableRooms: {
    name: string;
    _id: string;
    currentBookings: any[];
  }[];
  rangeDate: DateRange;

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

  // Fetch Quick Suggestions based on last booking
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

  // Handle room selection logic
  const handleSelectRoom = (room: any, type: string, dogId?: string) => () => {
    if (type === "Join") {
      // Handle 'Join' functionality (all dogs in the same room)
      const isAllDogsInRoom = dogsInRooms.every(
        (dogInRoom: any) => dogInRoom.roomId === room._id
      );
      const updatedDogsInRooms = dogsInRooms.map((dogInRoom: any) => {
        if (isAllDogsInRoom) {
          // If all dogs are already in the selected room, remove them from the room
          return { ...dogInRoom, roomId: null, roomName: null };
        } else {
          // Otherwise, put all dogs in the selected room
          return { ...dogInRoom, roomId: room._id, roomName: room.name };
        }
      });

      setDogsInRooms(updatedDogsInRooms);
    } else {
      const updatedDogsInRooms = dogsInRooms.map((dogInRoom: any) =>
        dogInRoom.dogId === dogId
          ? {
              ...dogInRoom,
              roomId: dogInRoom.roomId === room._id ? null : room._id,
              roomName: dogInRoom.roomId === room._id ? null : room.name,
            }
          : dogInRoom
      );

      setDogsInRooms(updatedDogsInRooms);
    }
  };

  // Submit Room Selections
  const handleSubmit = useCallback(() => {
    // Filter out any dogs that don't have a room assigned (i.e., roomId === null)
    const filteredDogsInRooms = dogsInRooms.filter(
      (dog) => dog.roomId !== null
    );

    // Check if all the remaining dogs are in the same room (Join)
    const roomPreference = filteredDogsInRooms.every(
      (dog) => filteredDogsInRooms[0]?.roomId === dog.roomId
    )
      ? "Join"
      : "Separate";

    // Update room preference and set data only with dogs that have assigned rooms
    setRoomPreference(roomPreference);
    setData(filteredDogsInRooms); // Save only the dogs with assigned rooms
    setStages(1); // Move to the next stage
  }, [dogsInRooms, setRoomPreference, setData, setStages]);

  // Render Quick Suggestion based on last booking
  const renderQuickSuggestion = () => {
    if (!quickSuggestion) return null;

    const suggestionType =
      quickSuggestion?.type === "Join" ? "ΜΑΖΙ" : "ΔΙΑΧΩΡΙΣΜΕΝΑ";

    return (
      <div className="mt-4 flex w-full items-center gap-4 rounded-lg bg-gray-100 p-4 dark:bg-neutral-800">
        <span className="flex flex-row items-center text-lg font-medium text-gray-800 dark:text-gray-200">
          {suggestionType} <IconArrowRight size={24} />
        </span>

        {quickSuggestion?.type === "Join" ? (
          <button
            className={cn(
              "min-w-[140px] min-h-[40px] flex items-center justify-center gap-2 rounded-md bg-black px-8 py-2 text-sm font-semibold text-white hover:bg-black/[0.8] hover:shadow-lg",
              { "bg-red-600": !quickSuggestion.rooms?.availability }
            )}
            disabled={!quickSuggestion.rooms?.availability}
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
              (room) => room.roomId === quickSuggestion.rooms?.roomId
            ) && <IconCheck size={22} className="text-yellow-500" />}
          </button>
        ) : (
          <div className="ml-4 flex flex-col items-center gap-2">
            {quickSuggestion?.rooms?.map((room: any) => (
              <div
                key={room.roomId}
                className="flex flex-row items-center gap-4"
              >
                <span className="min-w-[5vw]">{room?.dogName}</span>
                <button
                  className={cn(
                    "min-w-[10vw] flex items-center justify-center gap-2 rounded-md bg-black px-8 py-2 text-sm font-semibold text-white hover:bg-black/[0.8] hover:shadow-lg",
                    {
                      "bg-red-600 hover:bg-red-600 cursor-pointer":
                        !room.availability,
                    }
                  )}
                  onClick={() => {
                    const newRoom: any = {
                      _id: room.roomId,
                      name: room.roomName,
                    };

                    handleSelectRoom(newRoom, "Separate", room.dogId)();
                  }}
                  disabled={!room.availability}
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
          handleSubmit={handleSubmit}
        />
      </section>
    </section>
  );
};

export default SelectRooms;
