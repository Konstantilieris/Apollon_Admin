import JoinView from "@/components/clientProfile/Book/RoomResults/TabRoomViews/JoinView";
import useEditBookingStore from "@/hooks/editBooking-store";
import { getAllAvailableRooms } from "@/lib/actions/booking.action";
import React, { useCallback, useEffect } from "react";
interface props {
  setData: any;

  event: any;
  setRoomPreference: any;
  setStage: any;
  client: any;
}
const ThirdStage = ({
  setData,
  event,
  setRoomPreference,
  setStage,
  client,
}: props) => {
  // here we are in the third stage because there is no availability for this room and we need to select another room
  // so there is no point in initialising the dogsInRooms with the dogsData from the event but rather with the dogs without a room so we need to take the event.dogsData and filter out roomName and roomId
  const [dogsInRooms, setDogsInRooms] = React.useState(
    event.dogsData.map((dog: any) => ({ ...dog, roomId: null, roomName: null }))
  );
  const [isNext, setIsNext] = React.useState(false);
  const [availableRooms, setAvailableRooms] = React.useState<any>([]);
  const { dateArrival, dateDeparture } = useEditBookingStore();
  // eslint-disable-next-line no-unused-vars
  const [freeCapacityPercentage, setFreeCapacityPercentage] =
    React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = React.useState(false);
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

    // Check if all the remaining dogs are in the same room (Join)
    const roomPreference = filteredDogsInRooms.every(
      (dog: any) => filteredDogsInRooms[0]?.roomId === dog.roomId
    )
      ? "Join"
      : "Separate";

    // Update room preference and set data only with dogs that have assigned rooms
    setRoomPreference(roomPreference);
    setData(filteredDogsInRooms); // Save only the dogs with assigned rooms
    setStage(3); // Move to the next stage
  }, [dogsInRooms, setRoomPreference, setData, setStage]);

  return (
    <JoinView
      client={client}
      setStages={setStage}
      availableRooms={availableRooms}
      handleSelectRoom={handleSelectRoom}
      dogsInRooms={dogsInRooms}
      handleSubmit={handleSubmit}
      freeCapacityPercentage={parseFloat(freeCapacityPercentage)}
    />
  );
};

export default ThirdStage;
