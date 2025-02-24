"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createCategory } from "@/lib/actions/expenses.action";
import { useExpensesStore } from "@/hooks/expenses-store";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
});

export function CreateCategoryForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { resetStore, setIsOpen } = useExpensesStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await createCategory(values);
      if (res.success) {
        throw new Error("Failed to create category");
      }

      toast({
        title: "Success",
        description: "Category created successfully.",
      });
      form.reset();

      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      resetStore();
      setIsOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Όνομα Κατηγορίας</FormLabel>
              <FormControl>
                <Input
                  placeholder="Πληκτρολογήστε το όνομα της κατηγορίας"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Εισαγάγετε ένα μοναδικό όνομα για τη νέα κατηγορία.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Δημιουργία..." : "Δημιουργία Κατηγορίας"}
        </Button>
      </form>
    </Form>
  );
}
