"use client";
import React, { useState } from "react";
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
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { ClientValidation } from "@/lib/validation";
import * as z from "zod";
import { CreateClient } from "@/lib/actions/client.action";
import { DateInput } from "../shared/DateInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TypesOfResidence,
  TypesOfBehavior,
  TypesOfBreed,
  TypesOfFood,
  TypesOfGender,
} from "@/constants";

const ClientForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof ClientValidation>>({
    resolver: zodResolver(ClientValidation),
  });

  async function onSubmit(values: z.infer<typeof ClientValidation>) {
    setIsSubmitting(true);
    try {
      const client = await CreateClient(Object.assign({}, values));
      if (client) {
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Success",
          description: "Επιτυχία εγγραφής",
        });
      }
      router.replace("./main");
    } catch (error) {
      // Handle the error here
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία δημιουργίας Πελάτη!",
        description: `${error}`,
      });
    } finally {
      setIsSubmitting(false);
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex w-full flex-row items-start font-noto_sans max-md:flex-col"
        autoComplete="off"
      >
        <div className=" flex flex-1  flex-col items-center justify-center gap-2">
          <h2 className="border-b-2 border-black font-noto_sans text-[22px] font-bold dark:border-white ">
            Πελάτης
          </h2>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="form_item ">
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
          />{" "}
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
            name="dog_birthdate"
            render={({ field }) => (
              <FormItem className=" flex flex-row items-center gap-4 ">
                <FormLabel className="form_label  ">Ημ.Γέννησης</FormLabel>
                <FormControl>
                  <DateInput field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className=" flex flex-1  flex-col items-center justify-center gap-2">
          <span className=" border-b-2 border-black font-noto_sans text-xl font-bold dark:border-white">
            Κατοικίδιο Πελάτη
          </span>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="form_item">
                <FormLabel className="form_label">Όνομα</FormLabel>
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
            name="gender"
            render={({ field }) => (
              <FormItem className=" flex flex-row items-center gap-8">
                <FormLabel className="form_label ">Φύλο</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 min-h-[56px] min-w-[265px] rounded-lg p-2 font-noto_sans font-bold">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="background-light900_dark300 text-dark300_light700 rounded-lg p-4 ">
                    {TypesOfGender.map((item) => (
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
          />

          <FormField
            control={form.control}
            name="food"
            render={({ field }) => (
              <FormItem className=" flex flex-row items-center gap-8">
                <FormLabel className="form_label ">Τύπος Τροφής</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 min-h-[56px] min-w-[230px] rounded-lg p-2 font-noto_sans font-bold">
                      <SelectValue placeholder="Επέλεξε τύπο τροφής" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="background-light900_dark300 text-dark300_light700 rounded-lg p-4 ">
                    {TypesOfFood.map((item) => (
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
            name="breed"
            render={({ field }) => (
              <FormItem className=" flex flex-row items-center gap-8">
                <FormLabel className="form_label ">Ράτσα</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 min-h-[56px] min-w-[260px] rounded-lg p-2 font-noto_sans font-bold">
                      <SelectValue placeholder="Ράτσα" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="background-light900_dark300 text-dark300_light700 rounded-lg p-4 ">
                    {TypesOfBreed.sort().map((item) => (
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
            name="behavior"
            render={({ field }) => (
              <FormItem className=" flex flex-row items-center gap-10">
                <FormLabel className="form_label ">Συμπεριφορά</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 min-h-[56px] min-w-[235px] rounded-lg p-2 font-noto_sans font-bold">
                      <SelectValue placeholder="Behavior" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="background-light900_dark300 text-dark300_light700 rounded-lg p-4 ">
                    {TypesOfBehavior.map((item) => (
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

          <Button
            type="submit"
            className="form-button2 text-dark400_light500 mt-8 w-fit p-6 font-noto_sans text-lg font-bold hover:scale-105 "
            disabled={isSubmitting}
          >
            {isSubmitting ? <>{"Submitting"}</> : <>{"Submit"}</>}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;
