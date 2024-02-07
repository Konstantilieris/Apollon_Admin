"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TaskValidation } from "@/lib/validation";
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

import { useToast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Priority } from "@/constants";
import { usePathname } from "next/navigation";
import { CreateTask } from "@/lib/actions/task.action";

const TaskForm = () => {
  // eslint-disable-next-line no-unused-vars

  // eslint-disable-next-line no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const path = usePathname();

  const form = useForm<z.infer<typeof TaskValidation>>({
    resolver: zodResolver(TaskValidation),
    defaultValues: { title: "", description: "", priority: "1" },
  });

  const onSubmit = async (values: z.infer<typeof TaskValidation>) => {
    try {
      const newTask = await CreateTask({
        title: values.title,
        description: values.description,
        path,

        priority: parseInt(values.priority),
      });

      if (newTask) {
        window.location.reload();
        toast({
          className: cn(
            "bg-celtic-green border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
          ),
          title: "Επιτυχία",
          description: "Η εργασία δημιουργήθηκε",
        });
      }
    } catch (error) {
      toast({
        className: cn(
          "bg-red-dark border-none text-white  font-noto_sans text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed  "
        ),
        title: "Αποτυχία δημιουργίας",
        description: `${error}`,
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col ">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex   flex-col">
              <FormLabel className="text-dark400_light800 font-noto_sans text-lg font-bold">
                Τίτλος Εργασίας
              </FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  {...field}
                  className="no-focus  paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] max-w-[400px] border font-noto_sans"
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
              <FormLabel className="text-dark400_light800 font-noto_sans text-lg font-bold">
                Περιγραφή
              </FormLabel>
              <FormControl>
                <Textarea
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] max-w-[400px] border"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem className=" flex flex-row items-center gap-8">
              <FormLabel className="form_label ">Προτεραιότητα</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="background-light900_dark300 text-dark300_light700 paragraph-regular light-border-2 min-h-[32px] max-w-[50px] rounded-lg p-2 font-noto_sans font-bold">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="background-light900_dark300 text-dark300_light700 rounded-lg p-4 ">
                  {Priority.map((item) => (
                    <SelectItem
                      className={`hover:bg-sky-blue hover:opacity-50 `}
                      value={item.toString()}
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

        <Button
          type="submit"
          className="form-button w-fit font-noto_sans text-lg font-bold hover:scale-105"
          disabled={isSubmitting}
        >
          {isSubmitting ? <>{"Submitting"}</> : <>{"Submit"}</>}
        </Button>
      </form>
    </Form>
  );
};

export default TaskForm;
