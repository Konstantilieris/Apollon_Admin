"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChargeValidation } from "@/lib/validation";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { DateInput } from "../datepicker/DateInput";

const ChargeForm = ({ id }: any) => {
  const form = useForm<z.infer<typeof ChargeValidation>>({
    resolver: zodResolver(ChargeValidation),
    defaultValues: {
      serviceType: "",
      amount: "",
      date: new Date(),
    },
  });
  const onSubmit = async (values: z.infer<typeof ChargeValidation>) => {
    console.log("submit");
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col space-y-8"
      >
        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Τύπος Υπηρεσίας</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  {...field}
                  className="background-light850_dark100 text-dark100_light900 font-sans font-bold"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ποσό</FormLabel>
              <FormControl>
                <Input
                  placeholder="1"
                  type="number"
                  {...field}
                  className="background-light850_dark100 text-dark100_light900 font-sans font-bold"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center gap-4">
              <FormLabel className="form_label ">Ημερομηνία</FormLabel>

              <FormControl>
                <DateInput field={field} maxwidth={"min-w-[270px]"} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="background-light850_dark100 text-dark100_light900 max-w-[120px] self-center border-2 border-green-500 font-sans font-bold hover:scale-105"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ChargeForm;
