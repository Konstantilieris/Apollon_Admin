"use client";
import { RadioGroup, Radio } from "@heroui/react";
import { useUrlDateFilter } from "@/hooks/useUrlDateFilter";

const DateFiltering = () => {
  const { dateFilter, setDateFilter } = useUrlDateFilter();

  return (
    <RadioGroup
      label="Ημερομηνία"
      value={dateFilter}
      onValueChange={setDateFilter as any}
      color="secondary"
      className="font-sans tracking-wide"
    >
      <Radio value="all">Όλα</Radio>
      <Radio value="last7Days">Τελευταίες 7 ημέρες</Radio>
      <Radio value="last30Days">Τελευταίες 30 ημέρες</Radio>
      <Radio value="last60Days">Τελευταίες 60 ημέρες</Radio>
    </RadioGroup>
  );
};

export default DateFiltering;
