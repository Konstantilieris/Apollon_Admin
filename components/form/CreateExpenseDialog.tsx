"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ExpensesValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createExpense } from "@/lib/actions/expenses.action";
import { cn } from "@/lib/utils";
import { useToast } from "../ui/use-toast";

import { Input } from "../ui/input";
import { DateInput } from "../datepicker/DateInput";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Textarea } from "../ui/textarea";
const CreateExpenseDialog = ({ parentCategory }: { parentCategory: any }) => {
  const [stage, setStage] = useState(0);
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const [subCategory, setSubCategory] = useState<any>("");
  const form = useForm<z.infer<typeof ExpensesValidation>>({
    resolver: zodResolver(ExpensesValidation),
    defaultValues: {
      amount: "",
      description: "",

      date: new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof ExpensesValidation>) => {};
  const handleStage = async () => {
    if (stage === 1) {
      const { amount, date, description } = form.getValues();
      try {
        const expense = await createExpense({
          amount: parseFloat(amount),
          date,
          parentCategory,
          subCategory,
          description,
        });
        if (expense) {
          toast({
            className: cn(
              "bg-celtic-green border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
            ),
            title: "Επιτυχία",
            description: `η δαπάνη δημιουργήθηκε με επιτυχία`,
          });
          setStage(0);
          setOpen(false);
          form.reset();

          setSubCategory("");
        }
      } catch (error) {
        toast({
          className: cn(
            "bg-red-dark border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Αποτυχία",
          description: `${error}`,
        });
        form.reset();

        setSubCategory("");
        setStage(0);
      }
      return;
    }
    setStage(stage + 1);
  };
  const handleBack = () => {
    if (stage === 0) return;
    if (stage === 1) {
      form.reset();
      setStage(0);
    }
  };

  const handleDisable = () => {
    if (stage === 0) {
      return !subCategory;
    }
    if (stage === 1) {
      return (
        !form.getValues("amount") ||
        !form.getValues("date") ||
        !form.getValues("description")
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
      <AlertDialogTrigger asChild>
        <Button
          variant={"outline"}
          className="mb-4  border-rose-500 bg-rose-950 text-base text-white hover:bg-rose-700 hover:text-white"
        >
          Νέα Δαπάνη😤
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className={cn(
          "flex w-full flex-col rounded-lg  p-8 shadow-md shadow-red-400  background-light850_dark100 text-dark300_light700 min-h-[200px] min-w-[300px]"
        )}
      >
        <AlertDialogHeader className="gap-4">
          <AlertDialogTitle className="text-center font-sans">
            {stage === 0 && (
              <div className="flex flex-col gap-1 font-sans">
                <span className="text-xl ">Επιλογή </span>{" "}
              </div>
            )}
            {stage === 1 && (
              <span>
                <span className="font-bold text-red-500">
                  {" "}
                  {subCategory.name}
                </span>{" "}
                - Στοιχεία Δαπάνης
              </span>
            )}
          </AlertDialogTitle>
          <div>
            {stage === 0 ? (
              <div className="flex flex-col items-center gap-2">
                <h1 className="font-sans font-semibold">
                  {parentCategory.name}
                </h1>
                <Select onValueChange={(value) => setSubCategory(value)}>
                  <SelectTrigger className="w-[180px] font-sans font-normal">
                    <SelectValue placeholder="Υποκατηγορίες" />
                  </SelectTrigger>
                  <SelectContent className="background-light900_dark200  text-dark100_light900 py-2 font-sans ">
                    {parentCategory?.subCategories?.map((sub: any) => (
                      <SelectItem
                        key={sub._id}
                        value={sub}
                        className="hover:scale-105"
                      >
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-center text-sm text-blue-500">
                  Οι κατηγορίες χρησιμοποιούνται για την καλύτερη ομαδοποίηση
                  των συναλλαγών σας.
                </span>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="text-dark200_light900 flex w-full flex-row   flex-wrap    gap-2"
                >
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex  min-w-[0.5vw] flex-col">
                        <FormLabel className=" font-sans text-base font-normal">
                          Ημερομηνία δαπάνης
                        </FormLabel>
                        <FormControl>
                          <DateInput field={field} maxwidth={"min-w-[220px]"} />
                        </FormControl>
                        <span className=" font-sans text-sm text-blue-500">
                          π.χ. 21/05/2025
                        </span>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="flex  min-w-[0.5vw] flex-col">
                        <FormLabel className=" font-sans text-base font-normal">
                          Συνολικό Κόστος €
                        </FormLabel>
                        <FormControl>
                          <Input
                            className=" paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700  no-focus min-h-[56px] max-w-[400px] border font-sans font-bold"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <span className=" font-sans text-sm text-blue-500">
                          π.χ. 50.45
                        </span>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex  min-w-[0.5vw] flex-col">
                        <FormLabel className=" font-sans text-base font-normal">
                          Προσθέστε μια περιγραφή για τη δαπάνη σας
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] max-w-[400px] border"
                            {...field}
                          />
                        </FormControl>
                        <span className=" font-sans text-sm text-blue-500">
                          π.χ. Πληρωμή ηλεκτρικού ρεύματος
                        </span>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="absolute right-2 top-2 border-none font-sans text-sm font-semibold text-black hover:scale-105 hover:text-red-500 dark:text-white">
            X
          </AlertDialogCancel>

          <Button
            onClick={() => handleBack()}
            className=" border border-white bg-red-950 text-white hover:bg-red-700 hover:text-white"
            disabled={stage === 0}
          >
            Πίσω
          </Button>
          <Button
            onClick={() => handleStage()}
            className="border border-white bg-green-950 text-white hover:bg-green-700 hover:text-white"
            disabled={handleDisable()}
          >
            Συνέχεια
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateExpenseDialog;
