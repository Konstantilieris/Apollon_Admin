"use client";
import { RadioGroup, Radio } from "@heroui/react";
import { useUrlStatusFilter } from "@/hooks/useUrlStatusFilter";

const ExpenseStatus = () => {
  const { statusFilter, setStatusFilter } = useUrlStatusFilter();

  return (
    <RadioGroup
      label="Κατάσταση"
      value={statusFilter}
      onValueChange={setStatusFilter as any}
      color="secondary"
      className="font-sans tracking-wide"
    >
      <Radio value="all">Όλα</Radio>
      <Radio value="pending">Εκκρεμεί</Radio>
      <Radio value="paid">Πληρωμένο</Radio>
      <Radio value="overdue">Ληξιπρόθεσμο</Radio>
    </RadioGroup>
  );
};

export default ExpenseStatus;
