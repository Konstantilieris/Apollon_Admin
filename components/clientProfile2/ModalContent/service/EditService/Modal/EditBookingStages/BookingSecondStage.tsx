import React, { useCallback, useEffect, useState } from "react";

import useEditBookingStore from "@/hooks/editBooking-store";
import { getAllAvailableRooms } from "@/lib/actions/booking.action";
import { DogProp } from "@/types";
import { RoomSelectionTable } from "./AvailableRoomSelection";
import { RoomPreference } from "@/lib/utils";
import { getClientByIdForBooking } from "@/lib/actions/client.action";
import { Skeleton } from "@heroui/react";
type BookingClient = {
  clientId: string;
  clientName: string;
  phone: string;
  location: string;
  transportFee: number;
  bookingFee: number;
};
interface Props {
  setData: any;
  booking: any;
  setRoomPreference: any;
  setStage: any;
  clientId: any;
}

const BookingSecondStage: React.FC<Props> = ({
  setData,
  booking,
  setRoomPreference,
  setStage,
  clientId,
}) => {
  const [dogsInRooms, setDogsInRooms] = useState(
    booking.dogs.map((dog: any) => ({
      ...dog,
      roomId: null,
      roomName: null,
    }))
  );

  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  // eslint-disable-next-line no-unused-vars
  const [freeCapacityPercentage, setFreeCapacityPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const { dateArrival, dateDeparture } = useEditBookingStore();
  const [client, setClient] = useState<BookingClient>();

  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true);
      try {
        const res = await getClientByIdForBooking(clientId);
        if (!res) return;
        const data = JSON.parse(res);
        setClient(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      setLoading(true);
      try {
        if (!dateArrival || !dateDeparture) return;
        const { emptyRooms, freeCapacityPercentage } =
          await getAllAvailableRooms({ dateArrival, dateDeparture });

        setAvailableRooms(emptyRooms);
        setFreeCapacityPercentage(parseFloat(freeCapacityPercentage));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableRooms();
  }, [dateArrival, dateDeparture]);

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
    const assignedDogs = dogsInRooms.filter((dog: any) => dog.roomId !== null);
    const uniqueRoomIds = new Set(assignedDogs.map((dog: any) => dog.roomId));

    const roomPreference =
      uniqueRoomIds.size === 1 ? RoomPreference.JOIN : RoomPreference.SEPARATE;

    setRoomPreference(roomPreference);
    setData(assignedDogs);
    setStage(2);
  }, [dogsInRooms, setRoomPreference, setData, setStage]);

  const handleBack = () => setStage(0); // Or previous stage

  return (
    <Skeleton isLoaded={!loading && !!client}>
      <RoomSelectionTable
        availableRooms={availableRooms}
        client={client}
        onDogAssignment={handleDogAssignment}
        dogsInRooms={dogsInRooms}
        handleSubmit={handleSubmit}
        handleBack={handleBack}
      />
    </Skeleton>
  );
};

export default BookingSecondStage;
