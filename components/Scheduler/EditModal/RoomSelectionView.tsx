/* eslint-disable no-unused-vars */
"use client";
import JoinView from "@/components/clientProfile/Book/RoomResults/TabRoomViews/JoinView";
import { getAllAvailableRooms } from "@/lib/actions/booking.action";

import { IconHomeFilled } from "@tabler/icons-react";

import React, { useCallback, useEffect } from "react";

const RoomSelectionView = ({ rangeDate, client, setData, setStage }: any) => {
  const [loading, setLoading] = React.useState(false);
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
        const { emptyRooms, freeCapacityPercentage } =
          await getAllAvailableRooms({
            dateArrival: rangeDate.from,
            dateDeparture: rangeDate.to,
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
  }, [rangeDate]);
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
      const updatedDogsInRooms = dogsInRooms.map((dogInRoom: any) => {
        if (dogInRoom.dogId === dogId) {
          // Check if the dog is already in the selected room and toggle it
          if (dogInRoom.roomId === room._id) {
            return { ...dogInRoom, roomId: null, roomName: null }; // Remove from room
          } else {
            return { ...dogInRoom, roomId: room._id, roomName: room.name }; // Assign to room
          }
        }
        return dogInRoom;
      });

      setDogsInRooms(updatedDogsInRooms);
    }
  };

  const handleSubmit = useCallback(() => {
    // Filter out any dogs that don't have a room assigned (i.e., roomId === null)
    const filteredDogsInRooms = dogsInRooms.filter(
      (dog: any) => dog.roomId !== null
    );

    setData(filteredDogsInRooms); // Save only the dogs with assigned rooms
    setStage(1); // Move to the next stage
  }, [dogsInRooms, setData, setStage]);
  return (
    <section className="relative flex w-full flex-col px-4 max-md:items-start max-md:justify-items-start">
      <IconHomeFilled className="absolute left-0 top-0 h-8 w-8 text-yellow-500 max-md:hidden" />

      <div>
        {" "}
        <JoinView
          client={client}
          setStages={setStage}
          freeCapacityPercentage={parseFloat(freeCapacityPercentage)}
          availableRooms={availableRooms}
          handleSelectRoom={handleSelectRoom}
          dogsInRooms={dogsInRooms}
          handleSubmit={handleSubmit}
        />
      </div>
    </section>
  );
};

export default RoomSelectionView;
