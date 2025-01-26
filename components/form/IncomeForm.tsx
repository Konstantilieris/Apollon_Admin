"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "./CustomFormField";
import * as z from "zod";

import { IncomeValidation } from "@/lib/validation";
import { usePathname } from "next/navigation";
import { createIncome } from "@/lib/actions/service.action";

interface props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const IncomeForm = ({ setIsOpen }: props) => {
  const path = usePathname();
  const form = useForm<z.infer<typeof IncomeValidation>>({
    resolver: zodResolver(IncomeValidation),
    defaultValues: {
      serviceType: "",
      notes: "",
      amount: "",
      date: new Date(),
    },
  });
  const onSubmit = async (values: z.infer<typeof IncomeValidation>) => {
    console.log(values);
    try {
      await createIncome({
        serviceType: values.serviceType,
        notes: values.notes ?? "",
        amount: parseInt(values.amount),
        date: values.date,
        path,
      });
    } catch (error) {
      console.error("Error creating income:", error);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 flex-1 space-y-12"
      >
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Δημιουργία Εσόδου</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="serviceType"
            label="ΤΥΠΟΣ ΥΠΗΡΕΣΙΑΣ"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="notes"
            label="ΣΗΜΕΙΩΣΕΙΣ"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="amount"
            label="ΠΟΣΟ"
          />
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="date"
            iconSrc="/assets/icons/account.svg"
            iconAlt="user"
            label="ΗΜΕΡΟΜΗΝΙΑ"
          />
        </section>
        <div className="flex gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full rounded bg-transparent py-2 font-semibold text-white transition-colors hover:bg-white/10"
          >
            Ακύρωση
          </button>
          <button
            type="submit"
            className="w-full rounded bg-white py-2 font-semibold text-indigo-600 transition-opacity hover:opacity-90"
          >
            Αποθήκευση
          </button>
        </div>
      </form>
    </Form>
  );
};

export default IncomeForm;
