"use client";

import React, { useCallback, useEffect } from "react";

import { ClientProfileProps } from "@/types";
import JoinView from "./TabRoomViews/JoinView";
import { useBookingStore } from "@/hooks/booking-store";
import { getAllAvailableRooms } from "@/lib/actions/booking.action";

interface SelectRoomProps {
  client: ClientProfileProps;

  setStages: (stages: number) => void;
}
const SelectRooms = ({
  client,

  setStages,
}: SelectRoomProps) => {
  const [, setLoading] = React.useState(false);
  const {
    dateArrival,
    dateDeparture,

    setRoomPreference,

    setData,
  } = useBookingStore();
  const [availableRooms, setAvailableRooms] = React.useState<any>([]);
  const [isNext, setIsNext] = React.useState(false);

  const [freeCapacityPercentage, setFreeCapacityPercentage] =
    React.useState("");

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
        if (!dateArrival || !dateDeparture) return;
        const { emptyRooms, freeCapacityPercentage } =
          await getAllAvailableRooms({
            dateArrival,
            dateDeparture,
          });

        if (emptyRooms.length > 0) {
          setAvailableRooms(emptyRooms);
          setIsNext(isNext);
          setFreeCapacityPercentage(freeCapacityPercentage);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [dateArrival, dateDeparture]);
  // Fetch Quick Suggestions based on last booking

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
    setStages(2); // Move to the next stage
  }, [dogsInRooms]);

  // Render Quick Suggestion based on last booking

  return (
    <section className="absolute inset-0 h-full w-full">
      <JoinView
        freeCapacityPercentage={parseFloat(freeCapacityPercentage)}
        client={client}
        availableRooms={availableRooms}
        handleSelectRoom={handleSelectRoom}
        dogsInRooms={dogsInRooms}
        handleSubmit={handleSubmit}
        setStages={setStages}
      />
    </section>
  );
};

export default SelectRooms;
