"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  cn,
  constructDogsArray,
  findRoomNameById,
  isIdIncluded,
} from "@/lib/utils";
import { getDogsForClient } from "@/lib/actions/client.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { editBookingRooms } from "@/lib/actions/booking.action";
import { useToast } from "../ui/use-toast";

const RoomChange = (
  { rooms, booking }: any,
  setEditRoom: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [dogs, setDogs] = useState<any>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [selectedDogs, setSelectedDogs] = useState<any>([]);
  const [bookingData, setBookingData] = useState<any>([]);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const handleRooms = (room: any) => {
    // If the clicked room is already selected, deselect it
    if (selectedRoom && selectedRoom._id === room._id) {
      setSelectedRoom(null); // or setSelectedRoom(undefined) or setSelectedRoom({})
    } else {
      setSelectedRoom(room);
    }
  };
  const handleNext = () => {
    // Construct the dogs array based on the selected dogs and room
    const newDogsArray = constructDogsArray(selectedDogs, selectedRoom);

    // Check if any of the selected dogs are already in the booking data
    const dogsToAdd = newDogsArray.filter((newDog: any) =>
      bookingData.every((bookingDog: any) => bookingDog.dogId !== newDog.dogId)
    );

    // Update the state with the new dogs array and remove selected dogs
    setDogs(dogs.filter((dog: any) => !selectedDogs.includes(dog)));

    // Add the selected dogs and room to the new state, only if they are not already in the booking data
    setBookingData((prevData: any) => [...prevData, ...dogsToAdd]);
    setSelectedRoom(null);
  };
  const handleDogs = (dog: any) => {
    // Check if the dog is already selected
    const dogIndex = selectedDogs.findIndex(
      (selectedDog: any) => selectedDog._id === dog._id
    );

    if (dogIndex === -1) {
      // Dog is not selected, add it to the selectedDogs array
      setSelectedDogs((prevSelectedDogs: any) => [...prevSelectedDogs, dog]);
    } else {
      // Dog is already selected, remove it from the selectedDogs array
      setSelectedDogs((prevSelectedDogs: any) =>
        prevSelectedDogs.filter((_: any, index: any) => index !== dogIndex)
      );
    }
  };
  const handlePrev = () => {
    // Combine the existing dogs array with the selectedDogs
    const updatedDogs = [...dogs, ...selectedDogs];
    const lastDog = updatedDogs[updatedDogs.length - 1];
    // Set the state of dogs to include both existing dogs and selected dogs
    setDogs((previousdogs: any) => [...previousdogs, lastDog]);
    setBookingData((prevData: any) => prevData.slice(0, prevData.length - 1));
    // Clear the selectedDogs state
    setSelectedDogs((prevSelectedDogs: any) =>
      prevSelectedDogs.slice(0, prevSelectedDogs.length - 1)
    );
  };
  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const doggos = JSON.parse(await getDogsForClient(booking.clientId._id));
        if (doggos) setDogs(doggos);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDogs();
  }, []);
  const handleRoomChange = async () => {
    try {
      const updatedBooking = await editBookingRooms(booking._id, bookingData);

      if (updatedBooking) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: `το booking του πελάτη ${booking.clientId.lastName} τροποποιήθηκε`,
        });
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία τροποποιήσης",
        description: `${error}`,
      });
    } finally {
      window.location.reload();
      setSubmitting(false);
      setEditRoom(false);
    }
  };
  return (
    <div className="mb-2 flex flex-row justify-center gap-20 self-start">
      <ScrollArea className=" background-light700_dark400 h-72 w-48 rounded-md border-2 border-purple-700">
        <div className="p-4 font-noto_sans">
          <h4 className="mb-4 font-noto_sans text-lg font-bold leading-none">
            Δίαλεξε Σκυλους
          </h4>
          <Separator className="my-2 bg-slate-500" />
          {dogs.map((dog: any) => (
            <div key={dog._id} className="">
              <div
                className={cn(
                  `${
                    isIdIncluded(selectedDogs, dog._id)
                      ? "bg-celtic-green"
                      : "hover:bg-sky-300"
                  } rounded-md py-2 text-center font-semibold`
                )}
                onClick={() => handleDogs(dog)}
              >
                {dog?.name}
              </div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
      <ScrollArea className=" background-light700_dark400 h-72  w-48 rounded-md border-2 border-purple-600">
        <div className="p-4 font-noto_sans">
          <h4 className="mb-4 font-noto_sans text-lg font-bold leading-none">
            Δίαλεξε Δωμάτιο
          </h4>
          <Separator className="my-2 bg-slate-500" />
          {rooms.map((room: any) => (
            <div key={room._id} className="">
              <div
                onClick={() => handleRooms(room)}
                className={cn(
                  `${
                    selectedRoom?._id === room._id
                      ? "bg-celtic-green"
                      : "hover:bg-sky-300"
                  } rounded-md py-2 text-center font-semibold`
                )}
              >
                {room?.name}
              </div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>

      <Button
        className="btn self-center font-noto_sans font-bold"
        onClick={handlePrev}
        disabled={selectedDogs.length === 0 || bookingData.length === 0}
      >
        Prev
      </Button>
      <Button
        className="btn self-center font-noto_sans font-bold"
        onClick={handleNext}
        disabled={
          dogs.length === 0 || selectedDogs.length === 0 || !selectedRoom
        }
      >
        Next
      </Button>
      {bookingData.length > 0 && (
        <ScrollArea className=" background-light700_dark400 h-72 w-48 rounded-md border border-slate-600 dark:border-purple-500">
          <div className="p-4 font-noto_sans">
            <h4 className="mb-4 font-noto_sans text-lg font-bold leading-none">
              Σκύλος - Δωμάτιο
            </h4>
            {bookingData.map((data: any) => (
              <div key={data.dogId}>
                <div className=" rounded-md bg-sky-200 py-2 text-center font-noto_sans font-bold dark:text-dark-100">
                  {data.dogName} - ROOM{data.roomName}
                </div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <Button
        className="btn self-center border-2 border-celtic-green font-noto_sans font-bold hover:scale-105 hover:animate-pulse"
        disabled={bookingData.length === 0}
        onClick={() => setSubmitting(true)}
      >
        ΑΛΛΑΓΗ
      </Button>
      <AlertDialog open={submitting} onOpenChange={setSubmitting}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent className="background-light900_dark300 text-dark200_light900">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Πραγματοποιείται αλλαγή στα δωμάτια της κράτησης του{" "}
              {booking.clientId.lastName}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {bookingData.map((item: any) => {
                const matchedDog = booking.dogs.find(
                  (dog: any) => dog.dogId === item.dogId
                );
                if (matchedDog) {
                  return (
                    <div key={matchedDog.dogId}>
                      <p>
                        Dog Name: {matchedDog.dogName}
                        <br />
                        Old Room Name:{" "}
                        {findRoomNameById(matchedDog.roomId, rooms)}
                        <br />
                        New Room Name: {findRoomNameById(item.roomId, rooms)}
                      </p>
                    </div>
                  );
                }
                return null;
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:scale-105">
              Ακύρωση
            </AlertDialogCancel>
            <AlertDialogAction
              className="btn border-2 border-purple-700 hover:scale-105"
              onClick={handleRoomChange}
            >
              Συνέχεια
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoomChange;
