"use client";
import { DatePickerWithRange } from "@/components/datepicker/DateRangePicker";
import React, { useState } from "react";
import { SearchCommand } from "../SearchCommand";
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

import { searchRoomValidation } from "@/lib/validation";
import { addDays } from "date-fns";

const SearchRooms = ({ clients, setBooking }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof searchRoomValidation>>({
    resolver: zodResolver(searchRoomValidation),
    defaultValues: {
      rangeDate: { from: new Date(), to: addDays(new Date(), 1) },
    },
  });
  const handleBooking = (values: z.infer<typeof searchRoomValidation>) => {
    try {
      setIsSubmitting(true);
      setBooking(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleBooking)}
        className="flex flex-row  gap-4"
      >
        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="  text-dark200_light900 font-noto_sans text-lg font-bold ">
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
          name="rangeDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="  text-dark200_light900 font-noto_sans text-lg font-bold ">
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
        <Button
          type="submit"
          className="drawer_btn mt-9 max-h-[140px] "
          disabled={isSubmitting}
        >
          {isSubmitting ? <>{"ΑΝΑΜΟΝΗ"}</> : <>{"ΚΡΑΤΗΣΗ"}</>}
        </Button>
      </form>
    </Form>
  );
};

export default SearchRooms;
