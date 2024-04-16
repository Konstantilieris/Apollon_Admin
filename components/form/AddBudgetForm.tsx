"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ExpensesValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/input";
import { DateInput } from "../shared/DateInput";
import Image from "next/image";
import SelectInput from "../shared/SelectInput";
import { usePathname } from "next/navigation";
import { createExpense } from "@/lib/actions/expenses.action";
import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import ColorPicker from "../shared/ColorPicker";
const AddBudgetForm = ({ data }: any) => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [color, setColor] = useState("#FFD700");
  const path = usePathname();
  const disabled = false;
  const form = useForm<z.infer<typeof ExpensesValidation>>({
    resolver: zodResolver(ExpensesValidation),
    defaultValues: {
      amount: "",
      description: "",
      category: "",
      date: new Date(),
    },
  });
  const { toast } = useToast();
  const onSubmit = async (values: z.infer<typeof ExpensesValidation>) => {
    setIsSubmitting(true);
    try {
      const newExpense = await createExpense({
        amount: +values.amount,
        date: values.date,
        category: { name: values.category, color },
        description: values.description,
        path,
      });
      if (newExpense) {
        setShowForm(false);
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Success",
          description: "προστέθηκε με επιτυχία",
        });
      }
      setIsSubmitting(false);
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Failed to create!",
        description: `${error}`,
      });
      setIsSubmitting(false);
    } finally {
      form.reset();
      setIsSubmitting(false);
      setShowForm(false);
    }
  };

  return (
    <div className="flex">
      <Button onClick={() => setShowForm(!showForm)}>
        <Image
          src={!showForm ? "/assets/icons/plus.svg" : "/assets/icons/minus.svg"}
          alt="plus"
          width={35}
          height={30}
          className="rounded-xl bg-white"
        />
      </Button>
      {showForm && (
        <div
          className="flex w-full flex-row rounded-lg  p-8 shadow-lg shadow-white"
          style={{ backgroundColor: color }}
        >
          <ColorPicker color={color} setColor={setColor} disabled={disabled} />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-row flex-wrap   gap-2    text-black "
            >
              {" "}
              <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <span className="flex flex-row items-center self-center font-changa text-[40px] font-bold">
                  Προσθήκη Εξόδου
                  <Image
                    src={"/assets/icons/dude.svg"}
                    width={90}
                    height={30}
                    alt="dude"
                  />
                </span>
                <div className="flex flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="flex  min-w-[0.5vw] flex-col">
                        <FormLabel className=" font-noto_sans text-lg font-bold">
                          Κατηγορία
                        </FormLabel>
                        <FormControl>
                          <SelectInput
                            field={field}
                            data={data}
                            title={"Κατηγορίες"}
                            className="min-w-[220px]"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex  min-w-[0.5vw] flex-col">
                        <FormLabel className=" font-noto_sans text-lg font-bold">
                          Περιγραφή
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] max-w-[400px] border"
                            type="text"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="flex  min-w-[0.5vw] flex-col">
                        <FormLabel className=" font-noto_sans text-lg font-bold">
                          Ποσό
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700  min-h-[56px] max-w-[400px] border font-noto_sans font-bold"
                            type="number"
                            {...field}
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
                      <FormItem className="flex  min-w-[0.5vw] flex-col">
                        <FormLabel className=" font-noto_sans text-lg font-bold">
                          Ημερομηνία
                        </FormLabel>
                        <FormControl>
                          <DateInput field={field} maxwidth={"min-w-[220px]"} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="mt-4 w-fit self-center bg-pink-400 font-noto_sans text-lg font-bold text-white shadow-md shadow-white hover:scale-105 hover:animate-pulse"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <>{"Αναμονή"}</> : <>{"Προσθήκη"}</>}
                </Button>
              </div>
              <div></div>
              <div className="relative flex   flex-1 rounded-lg ">
                <Image
                  src={"/assets/icons/pig.svg"}
                  alt="pig"
                  fill
                  className="rounded-lg "
                />
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default AddBudgetForm;
