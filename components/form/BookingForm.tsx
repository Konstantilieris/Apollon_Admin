"use client";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";

import { BookingValidation1, BookingValidation2 } from "@/lib/validation";

import { DatePickerWithRange } from "../datepicker/DateRangePicker";
import { SearchCommand } from "../shared/SearchCommand";

import { TimePicker } from "../shared/timepicker/TimePicker";
import dynamic from "next/dynamic";

import { Separator } from "../ui/separator";
import { cn, constructDogsArray, isIdIncluded } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

const DynamicDialog = dynamic(() => import("../shared/AlertDialogSubmit"));
const BookingForm = ({ rooms, rangeDate, clients, open, close }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [stage, setStage] = useState(0);
  const [dogs, setDogs] = useState<any>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [selectedDogs, setSelectedDogs] = useState<any>([]);
  const [bookingData, setBookingData] = useState<any>([]);
  const [flag, setFlag] = useState(false);
  const form1 = useForm<z.infer<typeof BookingValidation1>>({
    resolver: zodResolver(BookingValidation1),
    defaultValues: {
      rangeDate: { from: rangeDate?.from, to: rangeDate?.to },
    },
  });
  const form2 = useForm<z.infer<typeof BookingValidation2>>({
    resolver: zodResolver(BookingValidation2),
    defaultValues: {
      time_arrival: new Date(),
      time_departure: new Date(),
    },
  });

  const handleBooking2 = (values: z.infer<typeof BookingValidation2>) => {
    try {
      setIsSubmitting(true);
      // Make sure this is synchronous or await if it's asynchronous
      setOpenDialog(true); // Make sure this is synchronous or await if it's asynchronous
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleBooking1 = (values: z.infer<typeof BookingValidation1>) => {
    try {
      setIsSubmitting(true);
      // Make sure this is synchronous or await if it's asynchronous
      setStage(1); // Make sure this is synchronous or await if it's asynchronous
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="">
      {stage === 0 && (
        <Form {...form1}>
          <form
            onSubmit={form1.handleSubmit(handleBooking1)}
            className="space-y-4"
          >
            <div className="flex flex-row items-center justify-around">
              <FormField
                control={form1.control}
                name="rangeDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="  font-noto_sans text-lg font-bold">
                      Διάλεξε ημερομηνίες
                    </FormLabel>
                    <FormControl>
                      <DatePickerWithRange
                        rangeDate={field.value}
                        setRangeDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="font-noto_sans text-lg font-bold text-red-dark" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col items-center">
              <FormField
                control={form1.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="  font-noto_sans text-lg font-bold">
                      Επέλεξε Πελάτη
                    </FormLabel>
                    <FormControl>
                      <SearchCommand
                        setDogs={setDogs}
                        clients={clients}
                        selectedClient={field.value}
                        setSelectedClient={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="font-noto_sans text-lg font-bold text-red-dark" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="drawer_btn mt-2 max-h-[140px] self-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? <>{"ΑΝΑΜΟΝΗ"}</> : <>{"ΣΥΝΕΧΕΙΑ"}</>}
              </Button>
            </div>
          </form>
        </Form>
      )}
      {stage === 1 && (
        <div className="ml-8 flex flex-row items-center justify-start gap-8">
          <h1 className=" text-center font-noto_sans text-[24px] font-bold">
            Επιθυμείτε μεταφορά;
          </h1>
          <Button
            className="border-2 border-red-600 bg-red-300 font-noto_sans font-extrabold text-black hover:scale-105 hover:animate-pulse"
            onClick={() => setStage(2)}
          >
            ΟΧΙ
          </Button>
          <Button
            className="border-2 border-white bg-purple-500 font-noto_sans font-extrabold text-black hover:scale-105 hover:animate-pulse"
            onClick={() => {
              setFlag(true);
              setStage(2);
            }}
          >
            {" "}
            ΝΑΙ
          </Button>
        </div>
      )}

      {stage === 2 && (
        <div>
          {dogs && (
            <div className="mb-2 flex flex-row justify-center gap-20">
              <ScrollArea className=" h-72 w-48 rounded-md border">
                <div className="p-4 font-noto_sans">
                  <h4 className="mb-4 font-noto_sans text-lg font-bold leading-none">
                    Δίαλεξε Σκυλους
                  </h4>
                  {dogs.map((dog: any) => (
                    <div key={dog._id} className="">
                      <div
                        className={cn(
                          `${
                            isIdIncluded(selectedDogs, dog._id)
                              ? "bg-celtic-green text-white"
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
              <ScrollArea className=" h-72 w-48  rounded-md border">
                <div className="p-4 font-noto_sans">
                  <h4 className="mb-4 font-noto_sans text-lg font-bold leading-none">
                    Δίαλεξε Δωμάτιο
                  </h4>
                  {rooms.map((room: any) => (
                    <div key={room._id} className="">
                      <div
                        onClick={() => handleRooms(room)}
                        className={cn(
                          `${
                            selectedRoom?._id === room._id
                              ? "bg-celtic-green text-white"
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
                  dogs.length === 0 ||
                  selectedDogs.length === 0 ||
                  !selectedRoom
                }
              >
                Next
              </Button>
              {bookingData.length > 0 && (
                <ScrollArea className=" h-72 w-48 rounded-md border border-slate-600 dark:border-purple-300">
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
            </div>
          )}
          <Form {...form2}>
            <form
              onSubmit={form2.handleSubmit(handleBooking2)}
              className="mt-2 flex flex-col items-center gap-2 space-y-4"
            >
              <div className="flex flex-row items-center justify-around">
                <div className="flex flex-row gap-16">
                  <FormField
                    control={form2.control}
                    name="time_arrival"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" font-noto_sans text-lg font-bold">
                          {flag
                            ? "Διάλεξε χρόνο παραλαβής"
                            : "Διάλεξε χρόνο άφιξης"}
                        </FormLabel>
                        <FormControl>
                          <TimePicker
                            date={field.value}
                            setDate={field.onChange}
                          />
                        </FormControl>
                        <FormMessage className="font-noto_sans text-lg font-bold text-red-dark" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form2.control}
                    name="time_departure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="  font-noto_sans text-lg font-bold">
                          {flag
                            ? "Διάλεξε χρόνο παράδοσης"
                            : "Διάλεξε χρόνο αναχώρησης"}
                        </FormLabel>
                        <FormControl>
                          <TimePicker
                            date={field.value}
                            setDate={field.onChange}
                          />
                        </FormControl>
                        <FormMessage className="font-noto_sans text-lg font-bold text-red-dark" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="drawer_btn mt-2 max-h-[140px] justify-center"
                disabled={isSubmitting || bookingData.length === 0}
              >
                {isSubmitting ? <>{"ΑΝΑΜΟΝΗ"}</> : <>{"ΣΥΝΕΧΕΙΑ"}</>}
              </Button>
            </form>
          </Form>
        </div>
      )}

      {openDialog && (
        <DynamicDialog
          close={close}
          flag={flag}
          open={openDialog}
          setOpen={setOpenDialog}
          selectedClient={form1?.getValues("client")}
          rangeDate={form1?.getValues("rangeDate")}
          timeArrival={form2?.getValues("time_arrival")}
          timeDeparture={form2?.getValues("time_departure")}
          bookingData={bookingData}
        />
      )}
    </div>
  );
};

export default BookingForm;
