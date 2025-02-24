import React from "react";
import { ModalFooter, Button, Input, Select, SelectItem } from "@heroui/react";

import { Form, FormControl, FormField } from "@/components/ui/form";

import { Loader2 } from "lucide-react";

type FormExpenseProps = {
  form: any;
  onSubmit: any;
  categories: any;
  isLoading: boolean;
  expense: any;
  type: any;
};
const FormExpense = ({
  form,
  onSubmit,
  categories,
  isLoading,
  expense,
  type,
}: FormExpenseProps) => {
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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name={"description"}
          render={({ field }) => (
            <FormControl>
              <Input
                type="text"
                label="Περιγραφή"
                value={field.value}
                onValueChange={field.onChange}
                description="Η περιγραφή της δαπάνης"
              />
            </FormControl>
          )}
        />
        <FormField
          control={form.control}
          name={"category"}
          render={({ field }) => (
            <FormControl>
              <Select
                description="Η κατηγορία της δαπάνης"
                onSelectionChange={(value) => {
                  const selectedValue = Array.from(value)[0];
                  field.onChange(selectedValue);
                }}
                value={field.value}
              >
                {categories.map((category: any) => (
                  <SelectItem key={category._id} className="font-sans ">
                    {category.name}
                  </SelectItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

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

        <FormField
          control={form.control}
          name={"amount"}
          render={({ field }) => (
            <FormControl>
              <Input
                type="number"
                label="Συνολικό Ποσό"
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
                description="Ο τρόπος πληρωμής της δαπάνης"
                onSelectionChange={(value) => {
                  const selectedValue = Array.from(value)[0];
                  field.onChange(selectedValue);
                }}
                value={field.value}
                color="success"
              >
                {paymentMethods.map((payment: any) => (
                  <SelectItem key={payment._id} className="font-sans ">
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
                onSelectionChange={(value) => {
                  const selectedValue = Array.from(value)[0];
                  field.onChange(selectedValue);
                }}
                value={field.value}
              >
                {statusOptions.map((status: any) => (
                  <SelectItem key={status._id} className="font-sans ">
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

        <ModalFooter className="flex justify-center">
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="tracking-widest"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin " />}
            {expense ? "Επεξεργασία" : "Δημιουργία"}
          </Button>
        </ModalFooter>
      </form>
    </Form>
  );
};

export default FormExpense;
