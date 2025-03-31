import React, { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@heroui/react";
import { RoomSelectionTable } from "../../ModalContent/service/EditService/Modal/EditBookingStages/AvailableRoomSelection";
import { getAllAvailableRooms } from "@/lib/actions/booking.action";
import { DogProp } from "@/types";
import { useBookingStore } from "@/hooks/booking-store";
import { getRoomPreference } from "@/lib/utils";

const BookingSecondStage = ({ client, handleNext, handleBack }: any) => {
  // Get values from the booking store.
  const { dateArrival, dateDeparture, setDogsData, setRoomPreference } =
    useBookingStore();

  // Local state for available rooms and loading status.
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [dogsInRooms, setDogsInRooms] = useState(
    client?.dog.map((dog: any) => ({
      dogId: dog._id,
      dogName: dog.name,
      roomId: null,
      roomName: null,
    })) || []
  );

  // Fetch available rooms based on the store’s dateArrival and dateDeparture.
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      setLoading(true);
      try {
        if (!dateArrival || !dateDeparture) return;
        const { emptyRooms } = await getAllAvailableRooms({
          dateArrival,
          dateDeparture,
        });
        setAvailableRooms(emptyRooms);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableRooms();
  }, [dateArrival, dateDeparture]);

  // If dogsData in the store is empty, initialize it using the client’s dog list.

  // Update dog-room assignment in the booking store.
  const handleDogAssignment = useCallback(
    (roomId: string, assignedDogs: DogProp[], roomName: string) => {
      setDogsInRooms((prevDogs: any) => {
        const assignedDogIds = new Set(assignedDogs.map((dog) => dog._id));

        return prevDogs.map((dogInRoom: any) => {
          if (assignedDogIds.has(dogInRoom.dogId)) {
            return {
              ...dogInRoom,
              roomId,
              roomName:
                availableRooms.find((room) => room._id === roomId)?.name ||
                null,
            };
          } else if (dogInRoom.roomId === roomId) {
            // Remove dog from room if deselected
            return { ...dogInRoom, roomId: null, roomName: null };
          }
          return dogInRoom;
        });
      });
    },
    [availableRooms]
  );
  const handleSubmit = useCallback(() => {
    // Filter out dogs that are not assigned to any room
    const filteredDogs = dogsInRooms.filter((dog: any) => dog.roomId !== null);
    const roomPrefer = getRoomPreference([...filteredDogs]);
    setRoomPreference(roomPrefer);
    setDogsData([...filteredDogs]);
    handleNext();
  }, [dogsInRooms, setDogsData, handleNext]);
  return (
    <Skeleton isLoaded={!loading && !!client}>
      <RoomSelectionTable
        availableRooms={availableRooms}
        client={client}
        onDogAssignment={handleDogAssignment}
        dogsInRooms={dogsInRooms} // dogsData is always an array.
        handleSubmit={handleSubmit}
        handleBack={handleBack}
      />
    </Skeleton>
  );
};

export default BookingSecondStage;
