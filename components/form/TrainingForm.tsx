"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import * as z from "zod";
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
import dynamic from "next/dynamic";
import { cn, isIdIncluded } from "@/lib/utils";
import { TrainingValidation1, TrainingValidation2 } from "@/lib/validation";
import { SearchCommand } from "../shared/SearchCommand";
import { DatePicker } from "../datepicker/DatePicker";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { TimePicker } from "../shared/timepicker/TimePicker";

const DynamicDialog = dynamic(() => import("../shared/TrainingDialog"));
const TrainingForm = ({ clients, setOpenForm }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stage, setStage] = useState<any>(0);
  const [dogs, setDogs] = useState<any>([]);
  const [selectedDogs, setSelectedDogs] = useState<any>([]);

  const form1 = useForm<z.infer<typeof TrainingValidation1>>({
    resolver: zodResolver(TrainingValidation1),
    defaultValues: {
      date: new Date(),
      client: {},
      name: "",
    },
  });
  const form2 = useForm<z.infer<typeof TrainingValidation2>>({
    resolver: zodResolver(TrainingValidation2),
    defaultValues: {
      time_arrival: new Date(),
      time_departure: new Date(),
      totalprice: "",
      notes: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof TrainingValidation1>) => {
    setIsSubmitting(true);
    setStage(1);
    setIsSubmitting(false);
  };
  const onSubmit2 = async (values: z.infer<typeof TrainingValidation2>) => {
    setIsSubmitting(true);
    setStage(2);
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

  if (stage === 0)
    return (
      <div className="text-dark200_light800 flex flex-col ">
        <h1 className="font-noto_sans text-[30px] font-bold">ΒΗΜΑ ΠΡΩΤΟ</h1>
        <Form {...form1}>
          <form
            onSubmit={form1.handleSubmit(onSubmit)}
            className="mt-12 flex flex-row flex-wrap  gap-4"
          >
            <FormField
              control={form1.control}
              name="name"
              render={({ field }) => (
                <FormItem className="   flex flex-col rounded-full">
                  <FormLabel className="text-dark400_light800 font-noto_sans text-lg font-bold">
                    Όνομα Εκπαίδευσης
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      {...field}
                      className="no-focus  paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[32px] max-w-[400px] border font-noto_sans font-bold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form1.control}
              name="client"
              render={({ field }) => (
                <FormItem className=" text-center font-noto_sans  text-lg font-bold">
                  <FormLabel className=" text-dark400_light800 font-noto_sans  text-lg font-bold">
                    Επέλεξε Πελάτη
                  </FormLabel>
                  <FormControl>
                    <SearchCommand
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
              control={form1.control}
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

            <div className="flex flex-row gap-4 ">
              <Button
                onClick={() => setOpenForm(false)}
                className="btn  mt-9 w-fit  border-2 border-red-500 font-noto_sans text-lg font-semibold text-black hover:scale-105 dark:text-white"
              >
                ΑΚΥΡΩΣΗ
              </Button>
              <Button
                type="submit"
                className="btn  mt-9 w-fit  border-2 border-purple-500 font-noto_sans text-lg font-semibold text-black hover:scale-105 dark:text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? <>{"ΑΝΑΜΟΝΗ"}</> : <>{"ΣΥΝΕΧΕΙΑ"}</>}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  if (stage === 1)
    return (
      <Form {...form2}>
        <form
          onSubmit={form2.handleSubmit(onSubmit2)}
          className="mt-12 flex flex-row flex-wrap  gap-4 dark:text-white"
        >
          <ScrollArea className=" background-light800_darkgradient h-72 w-48 rounded-md border-2 border-purple-500 dark:text-white">
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
          <div className="flex flex-row gap-16">
            <FormField
              control={form2.control}
              name="time_arrival"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  font-noto_sans text-lg font-bold">
                    Διάλεξε χρόνο άφιξης
                  </FormLabel>
                  <FormControl>
                    <TimePicker date={field.value} setDate={field.onChange} />
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
                    Διάλεξε χρόνο αναχώρησης
                  </FormLabel>
                  <FormControl>
                    <TimePicker date={field.value} setDate={field.onChange} />
                  </FormControl>
                  <FormMessage className="font-noto_sans text-lg font-bold text-red-dark" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form2.control}
            name="totalprice"
            render={({ field }) => (
              <FormItem className="text-center">
                <FormLabel className="  text-dark400_light800 font-noto_sans text-lg font-bold">
                  Συνολικό Κόστος
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    autoComplete="off"
                    {...field}
                    className="no-focus  paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700  min-h-[36px] max-w-[400px] border font-noto_sans font-bold"
                  />
                </FormControl>
                <FormMessage className="font-noto_sans text-lg font-bold text-red-dark" />
              </FormItem>
            )}
          />
          <FormField
            control={form2.control}
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
          <div className="flex flex-row gap-4 ">
            <Button
              onClick={() => {
                setStage(0);
                form1.reset();
              }}
              className="btn  mt-9 w-fit  border-2 border-red-500 font-noto_sans text-lg font-semibold text-black hover:scale-105 dark:text-white"
            >
              ΑΚΥΡΩΣΗ
            </Button>
            <Button
              type="submit"
              className="btn  mt-9 w-fit  border-2 border-purple-500 font-noto_sans text-lg font-semibold text-black hover:scale-105 dark:text-white"
              disabled={isSubmitting || !selectedDogs.length}
            >
              {isSubmitting ? <>{"ΑΝΑΜΟΝΗ"}</> : <>{"ΣΥΝΕΧΕΙΑ"}</>}
            </Button>
          </div>
        </form>
      </Form>
    );
  if (stage === 2)
    return (
      <DynamicDialog
        setStage={setStage}
        setIsSubmitting={setIsSubmitting}
        stage={stage}
        dogs={selectedDogs}
        totalprice={form2.getValues("totalprice")}
        timeArrival={form2.getValues("time_arrival")}
        timeDeparture={form2.getValues("time_departure")}
        date={form1.getValues("date")}
        client={form1.getValues("client")}
        name={form1.getValues("name")}
        notes={form2.getValues("notes")}
      />
    );
};

export default TrainingForm;
