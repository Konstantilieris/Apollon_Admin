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
import {
  createExpense,
  createSubCategory,
} from "@/lib/actions/expenses.action";
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

import SubCategoryCommand from "../shared/expenses/SubCategoryCommand";
import { Textarea } from "../ui/textarea";
const CreateExpenseDialog = ({ data }: { data: any }) => {
  const [stage, setStage] = useState(0);
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [parentCategory, setParentCategory] = useState<any>("");
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
    if (stage === 2) {
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
              "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
            ),
            title: "Επιτυχία",
            description: `η δαπάνη δημιουργήθηκε με επιτυχία`,
          });
          setStage(0);
          setOpen(false);
          form.reset();
          setParentCategory("");
          setSubCategory("");
        }
      } catch (error) {
        toast({
          className: cn(
            "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Αποτυχία",
          description: `${error}`,
        });
        form.reset();
        setParentCategory("");
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
      setParentCategory("");
      setSubCategory("");
      setStage(0);
    }
    if (stage === 2) {
      setStage(1);
      form.setValue("description", "");
    }
  };
  const createSub = async ({
    name,
    icon,
    color,
  }: {
    name: string;
    icon: string;
    color: string;
  }) => {
    try {
      const sub = await createSubCategory({
        name,
        icon,
        color,
        parentCategory,
      });
      if (sub) {
        setSubCategory(sub);
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: `η υποκατηγορία ${sub.name} δημιουργήθηκε με επιτυχία`,
        });
        setStage(2);
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία",
        description: `${error}`,
      });
    }
  };
  const handleDisable = () => {
    if (stage === 0) {
      return !form.getValues("amount");
    }
    if (stage === 1) {
      return !parentCategory || !subCategory;
    }
    if (stage === 2) {
      return !form.getValues("description");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
      <AlertDialogTrigger asChild>
        <Button
          variant={"outline"}
          className="mt-4 border-rose-500 bg-rose-950 text-base text-white hover:bg-rose-700 hover:text-white"
        >
          Νέα Δαπάνη😤
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className={cn(
          "flex w-full flex-col rounded-lg  p-8 shadow-md shadow-red-400  background-light850_dark100 text-dark300_light700"
        )}
      >
        <AlertDialogHeader className="gap-4">
          <AlertDialogTitle className="text-center font-noto_sans">
            {stage === 0 && "Δημιουργία Δαπάνης 😤"}
            {stage === 1 && (
              <div className="flex flex-col gap-1 font-noto_sans">
                <span className="text-xl ">
                  Επιλογή{" "}
                  <span className="font-bold text-red-500">Κατηγορίας </span>
                </span>{" "}
                <span className="text-start text-sm text-blue-500">
                  Οι κατηγορίες χρησιμοποιούνται για την καλύτερη ομαδοποίηση
                  των συναλλαγών σας.
                </span>
              </div>
            )}
            {stage === 2 && "Περιγραφή Δαπάνης"}
          </AlertDialogTitle>
          <div>
            {stage === 0 || stage === 2 ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="text-dark200_light900 flex w-full flex-row   flex-wrap    gap-2"
                >
                  {stage === 0 ? (
                    <>
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex  min-w-[0.5vw] flex-col">
                            <FormLabel className=" font-noto_sans text-base font-normal">
                              Ημερομηνία δαπάνης
                            </FormLabel>
                            <FormControl>
                              <DateInput
                                field={field}
                                maxwidth={"min-w-[220px]"}
                              />
                            </FormControl>
                            <span className=" font-noto_sans text-sm text-blue-500">
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
                            <FormLabel className=" font-noto_sans text-base font-normal">
                              Συνολικό Κόστος €
                            </FormLabel>
                            <FormControl>
                              <Input
                                className=" paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700  no-focus min-h-[56px] max-w-[400px] border font-noto_sans font-bold"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <span className=" font-noto_sans text-sm text-blue-500">
                              π.χ. 50.45
                            </span>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="flex  min-w-[0.5vw] flex-col">
                          <FormLabel className=" font-noto_sans text-base font-normal">
                            Προσθέστε μια περιγραφή για τη δαπάνη σας
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] max-w-[400px] border"
                              {...field}
                            />
                          </FormControl>
                          <span className=" font-noto_sans text-sm text-blue-500">
                            π.χ. Πληρωμή ηλεκτρικού ρεύματος
                          </span>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </form>
              </Form>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Select
                  onValueChange={(value) => setParentCategory(value)}
                  value={parentCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="ΚΑΤΗΓΟΡΙΑ" />
                  </SelectTrigger>
                  <SelectContent className="background-light900_dark200  text-dark100_light900 font-noto_sans ">
                    {data?.map((category: any) => (
                      <SelectItem
                        key={category._id}
                        value={category}
                        className="hover:scale-105"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {parentCategory && (
                  <SubCategoryCommand
                    title={"Διάλεξε η δημιούργησε υποκατηγορία"}
                    groupName={"Υποκατηγορίες"}
                    subTitle={"Εξόδων"}
                    create={createSub}
                    isIcon={true}
                    isColor={true}
                    parentCategory={parentCategory}
                    setSubCategory={setSubCategory}
                    subCategory={subCategory}
                    mainData={parentCategory.subCategories}
                  />
                )}
              </div>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="absolute right-2 top-2 border-none font-noto_sans text-sm font-semibold text-white hover:scale-105 hover:text-red-500">
            X
          </AlertDialogCancel>

          <Button
            onClick={() => handleBack()}
            className="border border-white bg-red-950 text-white hover:bg-red-700 hover:text-white"
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
