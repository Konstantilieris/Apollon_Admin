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
import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { TrainingValidation } from "@/lib/validation";
import { SearchCommand } from "../shared/SearchCommand";
import { DatePicker } from "../datepicker/DatePicker";
import { Textarea } from "../ui/textarea";
const TrainingForm = ({ clients }: any) => {
  const [openForm, setOpenForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof TrainingValidation>>({
    resolver: zodResolver(TrainingValidation),
    defaultValues: {
      date: new Date(),
    },
  });
  const onSubmit = async (values: z.infer<typeof TrainingValidation>) => {};
  return (
    <>
      {!openForm ? (
        <Button
          onClick={() => setOpenForm(!openForm)}
          className="btn text-dark500_light700 mt-8 p-4 font-noto_sans text-lg font-bold hover:animate-pulse "
        >
          Καταχώρηση Εκπαίδευσης
        </Button>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-12 flex flex-row flex-wrap  items-start gap-4"
          >
            <FormField
              control={form.control}
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
                      className="no-focus  paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[32px] max-w-[400px] border font-noto_sans"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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
            <FormField
              control={form.control}
              name="durationHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="  text-dark400_light800 font-noto_sans text-lg font-bold">
                    Διάρκεια Εκπαίδευσης
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      autoComplete="off"
                      {...field}
                      className="no-focus  paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[36px] max-w-[400px] border font-noto_sans"
                    />
                  </FormControl>
                  <FormMessage className="font-noto_sans text-lg font-bold text-red-dark" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pricePerHour"
              render={({ field }) => (
                <FormItem className="text-center">
                  <FormLabel className="  text-dark400_light800 font-noto_sans text-lg font-bold">
                    Χρέωση ανά ώρα
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      autoComplete="off"
                      {...field}
                      className="no-focus  paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700  min-h-[36px] max-w-[400px] border font-noto_sans"
                    />
                  </FormControl>
                  <FormMessage className="font-noto_sans text-lg font-bold text-red-dark" />
                </FormItem>
              )}
            />
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
                      className="no-focus  paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700  min-h-[36px] max-w-[400px] border font-noto_sans"
                    />
                  </FormControl>
                  <FormMessage className="font-noto_sans text-lg font-bold text-red-dark" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="form-button   mt-9 w-fit self-start font-noto_sans text-lg font-bold hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? <>{"Submitting"}</> : <>{"Submit"}</>}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
};

export default TrainingForm;
