"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "sonner";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/actions/expenses.action";
import { useExpensesStore } from "@/hooks/expenses-store";
import { useCategories } from "@/hooks/use-categories";
import { Pencil, Trash2, Plus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button, Input } from "@heroui/react";
const formSchema = z.object({
  name: z.string().min(2, {
    message:
      "Το όνομα της κατηγορίας πρέπει να είναι τουλάχιστον 2 χαρακτήρες.",
  }),
});

export function CreateCategoryForm() {
  const router = useRouter();

  const [editRow, setEditRow] = useState(null);
  const [editError, setEditError] = useState("");
  const { categories, refreshCategories } = useCategories();

  const [isLoading, setIsLoading] = useState(false);
  const [editValue, setEditValue] = useState("");
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

      toast.success("Category created successfully.");

      router.refresh();
      form.reset();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category. Please try again.");
    } finally {
      refreshCategories();
      setIsLoading(false);
      resetStore();
      setIsOpen(false);
    }
  }
  const onEdit = (category: any) => {
    if (editRow === category._id) {
      setEditRow(null);
    } else {
      setEditRow(category._id);
    }
  };
  const onDelete = async (category: any) => {
    const res = await deleteCategory(category._id);
    if (res.success) {
      toast.success("Category deleted successfully.");
      refreshCategories();
    } else {
      toast.error("Failed to delete category. Please try again.");
    }
  };
  const handleSaveEdit = async (category: any) => {
    const result = formSchema.safeParse({ name: editValue });
    if (!result.success) {
      setEditError(result.error.errors[0].message);
      return;
    }
    // TODO: Implement update API call here with the new name (editValue)
    const res = await updateCategory(category._id, { name: editValue });
    if (res.success) {
      toast({
        title: "Success",
        description: "Category updated successfully.",
        className: "bg-green-500 font-sans text-light-900",
      });
      refreshCategories();
    }

    setEditRow(null);
    setEditValue("");
    setEditError("");
  };

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-4 space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    isRequired
                    classNames={{
                      description: "text-light-500 tracking-wide",
                    }}
                    color="success"
                    variant="bordered"
                    isInvalid={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    label="Όνομα Κατηγορίας"
                    description="Προσθέστε μια νέα κατηγορία"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="md"
            color="success"
            variant="bordered"
            isLoading={isLoading}
            startContent={<Plus className="mr-1 h-4 w-4" />}
          >
            Προσθήκη Κατηγορίας
          </Button>
        </form>
      </Form>
      <div className="max-h-[50vh] space-y-2 overflow-y-auto py-2">
        {categories.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Δεν υπάρχουν κατηγορίες
          </p>
        ) : (
          categories.map((category) => (
            <Card key={category._id} className="border shadow-none">
              <CardContent className="flex items-center justify-between p-3">
                {editRow === category._id ? (
                  <Input
                    value={editValue}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setEditValue(newValue);
                      const result = formSchema.safeParse({ name: newValue });
                      if (!result.success) {
                        setEditError(result.error.errors[0].message);
                      } else {
                        setEditError("");
                      }
                    }}
                    size="md"
                    className="w-1/2"
                    isInvalid={!!editError}
                    errorMessage={editError}
                    label="Επεξεργασία Κατηγορίας"
                    color="success"
                    variant="bordered"
                  />
                ) : (
                  <span className="font-medium">{category.name}</span>
                )}
                <div className="flex gap-2">
                  {editRow === category._id ? (
                    <>
                      <Button
                        size="sm"
                        color="success"
                        variant="bordered"
                        startContent={<Plus className="mr-1 h-4 w-4" />}
                        onPress={() => handleSaveEdit(category)}
                      >
                        Αποθήκευση
                      </Button>
                      <Button
                        size="sm"
                        variant="bordered"
                        color="danger"
                        startContent={<Trash2 className="mr-1 h-4 w-4" />}
                        onPress={() => setEditRow(null)}
                      >
                        Ακύρωση
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        onPress={() => onEdit(category)}
                        variant="bordered"
                        color="warning"
                      >
                        <Pencil className="mr-1 h-4 w-4" />
                        Επεξεργασία
                      </Button>
                      <Button
                        size="sm"
                        onPress={() => onDelete(category)}
                        endContent={<Trash2 className="h-4 w-4" />}
                        variant="bordered"
                        color="danger"
                      >
                        Διαγραφή
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
