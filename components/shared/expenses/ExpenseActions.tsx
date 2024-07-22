"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import z from "zod";
import { ExpensesValidation } from "@/lib/validation";
import { deleteExpense, updateExpense } from "@/lib/actions/expenses.action";
import { cn, formatDateUndefined } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateInput } from "@/components/datepicker/DateInput";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
const ExpenseActions = ({ expense }: { expense: any }) => {
  const [action, setAction] = React.useState<string>("");
  const { toast } = useToast();
  const handleDelete = async () => {
    await deleteExpense({ id: expense._id, path: "/expenses" });
    setAction("");
    window.location.reload();
  };
  const form = useForm<z.infer<typeof ExpensesValidation>>({
    resolver: zodResolver(ExpensesValidation),
    defaultValues: {
      amount: expense?.amount,
      description: expense?.description,
      date: new Date(expense?.date),
    },
  });
  const onSubmit = async (values: z.infer<typeof ExpensesValidation>) => {
    try {
      const res = await updateExpense({
        id: expense._id,
        amount: parseFloat(values.amount),
        description: values.description,
        date: values.date,
      });
      if (res) {
        toast({
          title: "Επιτυχής ενημέρωση",
          description: "Η δαπάνη ενημερώθηκε με επιτυχία",
          className: cn(
            "bg-celtic-green border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          duration: 5000,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία",
        description: `${error}`,
      });
    } finally {
      setAction("");
      window.location.reload();
    }
  };

  return (
    <>
      <Select onValueChange={setAction} value={action}>
        <SelectTrigger className="w-[70px] ">
          <SelectValue placeholder="..." />
        </SelectTrigger>
        <SelectContent className="background-light900_dark300 text-light850_dark500 max-w-[40px] ">
          <SelectItem value="edit" className="ml-4 hover:scale-105">
            <Image
              src="/assets/icons/edit.svg"
              width={23}
              height={23}
              alt="delete"
            />
          </SelectItem>
          <SelectItem
            value="delete"
            className="ml-4 self-center hover:scale-105"
          >
            <Image
              src="/assets/icons/trash.svg"
              width={23}
              height={23}
              alt="delete"
            />
          </SelectItem>
        </SelectContent>
      </Select>
      <AlertDialog open={action === "delete"}>
        <AlertDialogContent className="background-light800_dark400 text-dark100_light900 min-h-[200px] font-sans">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Διαγραφή Δαπάνης{" "}
              {formatDateUndefined(new Date(expense?.date), "el")}-{" "}
              {expense?.description}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Είστε σίγουροι ότι θέλετε να διαγράψετε την δαπάνη;
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="h-11 w-24 rounded-lg border border-red-600 p-2 hover:scale-105"
              onClick={() => setAction("")}
            >
              Ακύρωση
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="h-11 w-24 rounded-lg border border-red-500 bg-white p-2 text-white hover:border-none hover:bg-red-800 hover:text-white"
            >
              <Image
                src="/assets/icons/trash.svg"
                width={20}
                height={20}
                alt="delete"
                className="invert-0"
              />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={action === "edit"}>
        <AlertDialogContent className="background-light800_dark400 text-dark100_light900 min-h-[200px] font-sans">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Επεξεργασία Δαπάνης{" "}
              {formatDateUndefined(new Date(expense?.date), "el")}-{" "}
              {expense?.description}
            </AlertDialogTitle>
            <AlertDialogDescription>
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
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="h-11 w-24 rounded-lg border border-red-600 p-2 hover:scale-105"
              onClick={() => {
                setAction("");
                form.reset();
              }}
            >
              Ακύρωση
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={form.handleSubmit(onSubmit)}
              className="h-11 w-24 rounded-lg border border-purple-500 bg-white p-2 text-white hover:border-none hover:!bg-purple-800 hover:text-white dark:bg-dark-200"
            >
              <Image
                src="/assets/icons/edit.svg"
                width={20}
                height={20}
                alt="edit"
                className="invert-0"
              />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ExpenseActions;
