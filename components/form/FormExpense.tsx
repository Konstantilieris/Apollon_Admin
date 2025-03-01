"use client";
import React, { useCallback, useState } from "react";
import {
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  DatePicker,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { parseDate } from "@internationalized/date";
import { Loader2 } from "lucide-react";
import { I18nProvider } from "@react-aria/i18n";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpenseSchema } from "@/lib/validation";
import { Expense } from "@/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { createExpense } from "@/lib/actions/expenses.action";
import { useExpensesStore } from "@/hooks/expenses-store";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/use-categories";

const FormExpense = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { categories } = useCategories();
  const { onClose } = useExpensesStore();
  const [isLoading, setIsLoading] = useState(false);
  const paymentMethods = [
    { _id: "cash", name: "Μετρητά" },
    { _id: "credit card", name: "Κάρτα" },
    { _id: "bank transfer", name: "Τραπεζική Μεταφορά" },
  ];
  const statusOptions = [
    { _id: "pending", name: "Εκκρεμεί" },
    { _id: "paid", name: "Πληρωμένο" },
    { _id: "overdue", name: "Ληξιπρόθεσμο" },
  ] as const;
  const form = useForm<Expense>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      amount: 0,
      taxAmount: 0,
      date: new Date().toISOString(),
      description: "",
      category: "",
      paymentMethod: "cash",
      vendor: {
        name: "",
        contactInfo: "",
        serviceType: "",
      },
      notes: "",
      status: "paid",
    },
  });
  const onSubmit = useCallback(
    async (data: Expense) => {
      console.log("Expense data submitted:", data);
      setIsLoading(true);
      try {
        const res = await createExpense(data);
        if (res.success) {
          toast({
            title: "Επιτυχία",
            description: "Η δαπάνη δημιουργήθηκε με επιτυχία",
            className: cn(
              "bg-celtic-green border-none text-white text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed font-sans"
            ),
          });
          onClose();
        }
        console.log("Expense data submitted:", data);
      } catch (error) {
        console.error("Error saving expense:", error);
      } finally {
        setIsLoading(false);
        router.refresh();
        form.reset();
      }
    },
    [toast, onClose, router, form]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Expense Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold tracking-widest">
            Λεπτομέρειες Δαπάνης
          </h3>
          <FormField
            control={form.control}
            name={"category"}
            render={({ field }) => (
              <FormControl>
                <Autocomplete
                  isRequired
                  label="Κατηγορία"
                  variant="bordered"
                  errorMessage="Η κατηγορία είναι υποχρεωτική"
                  description="Η κατηγορία της δαπάνης"
                  selectedKey={field.value}
                  onSelectionChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  {categories.map((category: any) => (
                    <AutocompleteItem key={category._id} className="font-sans">
                      {category.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </FormControl>
            )}
          />
          <FormField
            control={form.control}
            name={"date"}
            render={({ field }) => (
              <FormControl>
                <I18nProvider locale="el">
                  <DatePicker
                    label="Ημερομηνία"
                    variant="bordered"
                    isRequired
                    selectorButtonPlacement="start"
                    classNames={{
                      popoverContent: " font-sans",
                      input: "w-[200px]",
                      calendar: "w-full h-full",
                    }}
                    errorMessage="Η ημερομηνία είναι υποχρεωτική"
                    description="Η ημερομηνία της δαπάνης"
                    hideTimeZone
                    showMonthAndYearPickers
                    value={
                      !field.value
                        ? undefined
                        : typeof field.value === "string"
                          ? parseDate((field.value as string).split("T")[0])
                          : parseDate(
                              (field.value as Date).toISOString().split("T")[0]
                            )
                    }
                    onChange={(val) => {
                      if (!val) {
                        field.onChange(null);
                        return;
                      }
                      const utcMidnight = new Date(
                        Date.UTC(val.year, val.month - 1, val.day)
                      );
                      field.onChange(utcMidnight.toISOString());
                    }}
                  />
                </I18nProvider>
              </FormControl>
            )}
          />

          <FormField
            control={form.control}
            name={"amount"}
            render={({ field, fieldState }) => (
              <FormControl>
                <Input
                  type="number"
                  isRequired
                  variant="bordered"
                  errorMessage={fieldState.error?.message}
                  isInvalid={!!fieldState.error}
                  label="Συνολικό Ποσό"
                  startContent={
                    <span className="flex items-end pt-2 text-sm">€</span>
                  }
                  color="success"
                  value={field.value.toString()}
                  onValueChange={field.onChange}
                  min={0}
                  step={0.01}
                  description="Το συνολικό ποσό της δαπάνης"
                />
              </FormControl>
            )}
          />
          <FormField
            control={form.control}
            name={"taxAmount"}
            render={({ field }) => (
              <FormControl>
                <Input
                  type="number"
                  label="Φόρος"
                  variant="bordered"
                  value={field.value.toString()}
                  onValueChange={field.onChange}
                  min={0}
                  step={1}
                  description="Το ποσό του φόρου %"
                  color="success"
                  startContent={
                    <span className="flex items-end pt-2 text-sm">%</span>
                  }
                />
              </FormControl>
            )}
          />
          <FormField
            control={form.control}
            name={"paymentMethod"}
            render={({ field }) => (
              <FormControl>
                <Select
                  isRequired
                  variant="bordered"
                  label="Τρόπος Πληρωμής"
                  errorMessage="Ο τρόπος πληρωμής είναι υποχρεωτικός"
                  description="Ο τρόπος πληρωμής της δαπάνης"
                  onSelectionChange={(value) => {
                    const selectedValue = Array.from(value)[0];
                    field.onChange(selectedValue);
                  }}
                  value={field.value}
                  defaultSelectedKeys={[field.value]}
                  color="success"
                >
                  {paymentMethods.map((payment: any) => (
                    <SelectItem key={payment._id} className="font-sans">
                      {payment.name}
                    </SelectItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <FormField
            control={form.control}
            name={"status"}
            render={({ field }) => (
              <FormControl>
                <Select
                  description="Κατάσταση της δαπάνης"
                  color="success"
                  isRequired
                  errorMessage="Η κατάσταση της δαπάνης είναι υποχρεωτική"
                  label="Κατάσταση δαπάνης"
                  variant="bordered"
                  className="text-light-900"
                  classNames={{
                    mainWrapper: "text-light-900 text-lg",
                  }}
                  onSelectionChange={(value) => {
                    const selectedValue = Array.from(value)[0];
                    field.onChange(selectedValue);
                  }}
                  defaultSelectedKeys={[field.value]}
                >
                  {statusOptions.map((status: any) => (
                    <SelectItem key={status._id} className="font-sans">
                      {status.name}
                    </SelectItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <FormField
            control={form.control}
            name={"notes"}
            render={({ field }) => (
              <FormControl>
                <Input
                  type="text"
                  label="Σημειώσεις"
                  value={field.value}
                  onValueChange={field.onChange}
                  description="Σημειώσεις"
                />
              </FormControl>
            )}
          />
        </div>

        {/* Vendor Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold tracking-wide">
            Στοιχεία Προμηθευτή
          </h3>
          <FormField
            control={form.control}
            name={"vendor.name"}
            render={({ field }) => (
              <FormControl>
                <Input
                  type="text"
                  label="Προμηθευτής"
                  value={field.value}
                  onValueChange={field.onChange}
                  description="Ο προμηθευτής της δαπάνης"
                  color="secondary"
                />
              </FormControl>
            )}
          />
          <FormField
            control={form.control}
            name={"vendor.serviceType"}
            render={({ field }) => (
              <FormControl>
                <Input
                  type="text"
                  label="Τύπος Υπηρεσίας"
                  value={field.value}
                  onValueChange={field.onChange}
                  description="Ο τύπος υπηρεσίας του προμηθευτή"
                  color="secondary"
                />
              </FormControl>
            )}
          />
          <FormField
            control={form.control}
            name={"vendor.contactInfo"}
            render={({ field }) => (
              <FormControl>
                <Input
                  type="text"
                  label="Στοιχεία Επικοινωνίας"
                  value={field.value}
                  onValueChange={field.onChange}
                  description="Στοιχεία επικοινωνίας του προμηθευτή"
                  color="secondary"
                />
              </FormControl>
            )}
          />
        </div>
        <ModalFooter className="flex justify-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="tracking-widest"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Δημιουργία
          </Button>
        </ModalFooter>
      </form>
    </Form>
  );
};

export default FormExpense;
