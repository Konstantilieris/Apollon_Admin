import JoinView from "@/components/clientProfile/Book/RoomResults/TabRoomViews/JoinView";
import { getAllAvailableRooms } from "@/lib/actions/booking.action";
import React, { useCallback, useEffect } from "react";
interface props {
  data: any;
  setData: any;
  rangeDate: any;
  event: any;
  setRoomPreference: any;
  setStage: any;
  client: any;
}
const ThirdStage = ({
  data,
  setData,
  rangeDate,
  event,
  setRoomPreference,
  setStage,
  client,
}: props) => {
  const [dogsInRooms, setDogsInRooms] = React.useState(event.dogsData);
  const [isNext, setIsNext] = React.useState(false);
  const [availableRooms, setAvailableRooms] = React.useState<any>([]);

  const [freeCapacityPercentage, setFreeCapacityPercentage] =
    React.useState("");
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const { emptyRooms, freeCapacityPercentage } =
          await getAllAvailableRooms({
            rangeDate,
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
    setStage(3); // Move to the next stage
  }, [dogsInRooms, setRoomPreference, setData, setStages]);

  return (
    <JoinView
      client={client}
      availableRooms={availableRooms}
      handleSelectRoom={handleSelectRoom}
      dogsInRooms={dogsInRooms}
      handleSubmit={handleSubmit}
    />
  );
};

export default ThirdStage;
