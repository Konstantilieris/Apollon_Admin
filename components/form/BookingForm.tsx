"use client";
import React, { Suspense, useState } from "react";

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
import { Input } from "@/components/ui/input";
import { BookingValidation } from "@/lib/validation";

import { DatePickerWithRange } from "../datepicker/DateRangePicker";
import { SearchCommand } from "../shared/SearchCommand";
import { AlertDialogSubmit } from "../shared/AlertDialogSubmit";
import { TimePicker } from "../shared/timepicker/TimePicker";

const BookingForm = ({ room, rangeDate, clients }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<z.infer<typeof BookingValidation>>({
    resolver: zodResolver(BookingValidation),
    defaultValues: {
      rangeDate: { from: rangeDate?.from, to: rangeDate?.to },
      price: room?.price.toString(),
      unavailableDates: room?.unavailableDates,
    },
  });

  const handleBooking = (values: z.infer<typeof BookingValidation>) => {
    try {
      setIsSubmitting(true);
      // Make sure this is synchronous or await if it's asynchronous
      setOpenDialog(true); // Make sure this is synchronous or await if it's asynchronous
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleBooking)} className="space-y-4">
          <div className="flex flex-row items-center justify-around">
            <FormField
              control={form.control}
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
            <div className="flex flex-row gap-16">
              <FormField
                control={form.control}
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
                control={form.control}
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
          </div>
          <div className="flex flex-col items-center">
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  font-noto_sans text-lg font-bold">
                    Επέλεξε Πελάτη
                  </FormLabel>
                  <FormControl>
                    <SearchCommand
                      clients={clients}
                      selectedClient={field.value}
                      setSelectedClient={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className="font-noto_sans text-lg font-bold text-red-dark" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-center gap-2">
                  <FormLabel className="mt-2 font-noto_sans font-bold">
                    Επέλεξε Τιμή Δωματίου :{" "}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={field.value}
                      onChange={field.onChange}
                      className="background-light900_dark300  text-dark300_light700  light-border-2 no-focus max-h-[40px] max-w-[100px]  border font-noto_sans font-bold"
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
              {isSubmitting ? <>{"ΑΝΑΜΟΝΗ"}</> : <>{"ΚΡΑΤΗΣΗ"}</>}
            </Button>
          </div>
        </form>
      </Form>

      <Suspense>
        <AlertDialogSubmit
          open={openDialog}
          setOpen={setOpenDialog}
          selectedClient={form?.getValues("client")}
          rangeDate={form?.getValues("rangeDate")}
          timeArrival={form?.getValues("time_arrival")}
          timeDeparture={form?.getValues("time_departure")}
          roomId={room._id}
          roomName={room.name}
          price={form?.getValues("price")}
          form={form}
        />
      </Suspense>
    </div>
  );
};

export default BookingForm;
