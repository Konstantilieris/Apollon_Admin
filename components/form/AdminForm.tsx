/* eslint-disable no-unused-vars */
"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AdminValidation } from "@/lib/validation";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createAdmin } from "@/lib/actions/admin.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const AdminForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof AdminValidation>>({
    resolver: zodResolver(AdminValidation),
    defaultValues: {
      name: "",
      password: "",
      confirm: "",
    },
  });

  const handleCreateAdmin = async (values: z.infer<typeof AdminValidation>) => {
    setIsSubmitting(true);

    try {
      const user = await createAdmin({
        name: values.name,
        password: values.password,
        role: values.role,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      form.reset();
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateAdmin)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="flex w-full flex-row items-center gap-2">
              <FormLabel className="mt-2  text-lg font-bold text-white">
                Status
              </FormLabel>
              <FormControl className="rounded-full bg-white font-bold">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="ml-4 min-h-[40px] max-w-[150px] rounded-full bg-white px-4 text-center  ">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-none bg-dark-400">
                    <SelectItem
                      value="user"
                      className=" text-[20px] font-bold text-light-700"
                    >
                      User
                    </SelectItem>
                    <SelectItem
                      value="admin"
                      className=" text-[20px] font-bold text-light-700"
                    >
                      Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default AdminForm;
