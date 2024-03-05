"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { TransportationValidation } from "@/lib/validation";

import { DatePicker } from "../datepicker/DatePicker";
import { TimePicker } from "../shared/timepicker/TimePicker";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { cn, isIdIncluded } from "@/lib/utils";

import dynamic from "next/dynamic";
import { TransportCommand } from "../shared/TransportCommand";
import { Separator } from "../ui/separator";
const DynamicTransportDialog = dynamic(
  () => import("@/components/shared/TransportDialog")
);
const TransportationForm = ({ clients }: any) => {
  const form = useForm<z.infer<typeof TransportationValidation>>({
    resolver: zodResolver(TransportationValidation),
    defaultValues: {
      client: {},
      date: new Date(),
      notes: "",

      time_arrival: new Date(),
    },
  });
  const [open, setOpen] = useState(false);
  const [a, setA] = useState(false);
  const [stage, setStage] = useState(false);
  const [dogs, setDogs] = useState([]);
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
  const [selectedDogs, setSelectedDogs] = useState<any>([]);

  return (
    <div className="mt-10 flex flex-col p-8">
      {!stage && (
        <Button
          className="btn h-[45px] w-[220px] self-center border-2 border-yellow-600 px-2 font-bold text-white hover:scale-105 hover:animate-pulse"
          onClick={() => {
            setA(true);
          }}
        >
          Προσθήκη Νέας Μεταφοράς
        </Button>
      )}
      {open && (
        <DynamicTransportDialog
          stage={open}
          setStage={setOpen}
          dogs={selectedDogs}
          timeArrival={form.getValues("time_arrival")}
          date={form.getValues("date")}
          notes={form.getValues("notes")}
          client={form.getValues("client")}
        />
      )}
      {a && (
        <Drawer open={a} onOpenChange={setA}>
          <DrawerContent className="text-dark200_light800 background-light850_dark100  flex max-h-[800px] min-h-[500px] border-yellow-300 px-8">
            {stage === false ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(() => setStage(true))}
                  className="flex w-full flex-row space-y-8 p-8"
                >
                  <div className="flex flex-1 flex-col items-center justify-center gap-2">
                    <FormField
                      control={form.control}
                      name="client"
                      render={({ field }) => (
                        <FormItem className=" text-center font-noto_sans  text-lg font-bold">
                          <FormLabel className=" text-dark400_light800 font-noto_sans  text-lg font-bold">
                            Επέλεξε Πελάτη
                          </FormLabel>
                          <FormControl>
                            <TransportCommand
                              clients={clients}
                              selectedClient={field.value}
                              setSelectedClient={field.onChange}
                              setDogs={setDogs}
                            />
                          </FormControl>
                          <FormMessage className="font-noto_sans text-lg font-bold text-red-dark" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="text-center">
                          <FormLabel className="  text-dark400_light800 font-noto_sans text-lg font-bold">
                            Επέλεξε Ημερομηνία
                          </FormLabel>
                          <FormControl>
                            <DatePicker
                              date={field.value}
                              setDate={field.onChange}
                              className={" background-light900_dark300"}
                            />
                          </FormControl>
                          <FormMessage className="font-noto_sans text-lg font-bold text-red-dark" />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-row ">
                      <FormField
                        control={form.control}
                        name="time_arrival"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="  font-noto_sans text-lg font-bold">
                              Διάλεξε χρόνο άφιξης
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

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem className="text-center">
                          <FormLabel className="  text-dark400_light800 font-noto_sans text-lg font-bold">
                            Σημειώσεις
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              autoComplete="off"
                              {...field}
                              className="no-focus  paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700  min-h-[36px] max-w-[400px] border font-noto_sans font-bold"
                            />
                          </FormControl>
                          <FormMessage className="font-noto_sans text-lg font-bold text-red-dark" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-row items-end justify-end gap-2">
                    <Button
                      onClick={() => setA(false)}
                      className="btn  mt-9 w-fit  border-2 border-red-500 font-noto_sans text-lg font-semibold text-black hover:scale-105 dark:text-white"
                    >
                      ΑΚΥΡΩΣΗ
                    </Button>
                    <Button
                      type="submit"
                      className="btn  mt-9 w-fit  border-2 border-yellow-500 font-noto_sans text-lg font-semibold text-black hover:scale-105 dark:text-white"
                    >
                      ΣΥΝΕΧΕΙΑ
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <>
                <ScrollArea className=" background-light800_darkgradient h-72 w-48 self-center rounded-md border-2 border-yellow-500 dark:text-white">
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
                                ? "bg-yellow-500 text-black "
                                : "hover:bg-sky-300"
                            } rounded-md py-2 text-center font-bold font-noto_sans  cursor-pointer`
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
                <Button
                  onClick={() => {
                    setA(false);
                    setStage(false);
                  }}
                  className="btn  mt-9 w-fit  self-center border-2 border-red-500 font-noto_sans text-lg font-semibold text-black hover:scale-105 dark:text-white"
                >
                  ΑΚΥΡΩΣΗ
                </Button>
                <Button
                  onClick={() => {
                    setOpen(true);
                    setA(false);
                  }}
                  disabled={selectedDogs.length === 0}
                  className="btn  mt-9 w-fit  self-center border-2 border-yellow-500 font-noto_sans text-lg font-semibold text-black hover:scale-105 dark:text-white"
                >
                  ΣΥΝΕΧΕΙΑ
                </Button>
              </>
            )}
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default TransportationForm;
