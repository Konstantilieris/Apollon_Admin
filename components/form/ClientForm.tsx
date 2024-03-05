"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

import { ClientValidation } from "@/lib/validation";
import * as z from "zod";

import { DateInput } from "../shared/DateInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypesOfResidence } from "@/constants";

const ClientForm = ({ setClient, setStage }: any) => {
  const form = useForm<z.infer<typeof ClientValidation>>({
    resolver: zodResolver(ClientValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "johnny@gmail.com",
      profession: "",
      residence: "",
      city: "Αθήνα",
      address: "",
      birthdate: new Date(),
      mobile: "",
      telephone: "",
      vet: "",
      vetNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ClientValidation>) {
    setClient({ ...values });

    setStage(65);
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex w-full flex-row  font-noto_sans max-md:flex-col"
        autoComplete="off"
      >
        <div className=" flex flex-1  flex-col items-center gap-2">
          <div className="flex  flex-row justify-center gap-8">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="form_item">
                  <FormLabel className="form_label">Όνομα</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="new-password"
                      {...field}
                      className="no-focus  background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 form_input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="form_item">
                  <FormLabel className="form_label">Επώνυμο</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="new-password"
                      {...field}
                      className=" background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 form_input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row justify-between gap-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="form_item">
                  <FormLabel className="form_label">Email</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      {...field}
                      className=" background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 form_input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profession"
              render={({ field }) => (
                <FormItem className="form_item">
                  <FormLabel className="form_label">Επάγγελμα</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="new-password"
                      {...field}
                      className=" background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 form_input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row justify-between gap-8">
            <FormField
              control={form.control}
              name="residence"
              render={({ field }) => (
                <FormItem className=" flex flex-row items-center gap-4">
                  <FormLabel className="form_label "> Τύπος κατοικία</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 min-h-[56px] min-w-[246px] rounded-lg p-2 font-noto_sans font-bold">
                        <SelectValue placeholder="Τύπος κατοικίας" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="background-light900_dark300 text-dark300_light700 rounded-lg p-4 ">
                      {TypesOfResidence.map((item) => (
                        <SelectItem
                          className={`hover:bg-sky-blue hover:opacity-50 `}
                          value={item}
                          key={item}
                        >
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="form_item">
                  <FormLabel className="form_label">Διεύθυνση</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="new-password"
                      {...field}
                      className=" background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 form_input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row justify-between gap-8">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="form_item">
                  <FormLabel className="form_label">Πόλη</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="new-password"
                      {...field}
                      className=" background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 form_input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-4 ">
                  <FormLabel className="form_label">Ημ.Γέννησης</FormLabel>

                  <FormControl>
                    <DateInput field={field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />{" "}
          </div>
          <div className="flex flex-row justify-between gap-8">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem className="form_item">
                  <FormLabel className="form_label mr-2">Κινητό</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="new-password"
                      {...field}
                      className=" background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 form_input "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem className="form_item">
                  <FormLabel className="form_label">Σταθερό Τηλέφωνο</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="new-password"
                      {...field}
                      className=" background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 form_input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row justify-between gap-8">
            <FormField
              control={form.control}
              name="vet"
              render={({ field }) => (
                <FormItem className="form_item">
                  <FormLabel className="form_label">Κτηνίατρος</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="new-password"
                      {...field}
                      className=" background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 form_input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vetNumber"
              render={({ field }) => (
                <FormItem className="form_item">
                  <FormLabel className="form_label">Τηλ.Κτην.</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="new-password"
                      {...field}
                      className=" background-light900_dark300  paragraph-regular light-border-2 form_input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-8">
            <Button
              className="  mt-8 min-w-[135px] self-center bg-red-dark py-6 font-noto_sans text-[20px] font-extrabold text-white hover:scale-105 hover:animate-pulse"
              onClick={() => {
                setClient({});
                setStage(25);
              }}
            >
              {" "}
              ΠΙΣΩ
            </Button>
            <Button
              type="submit"
              className="mt-8 w-fit bg-primary-500 p-6 font-noto_sans text-lg font-bold text-black hover:scale-105 hover:animate-pulse "
            >
              ΕΠΟΜΕΝΟ
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;
