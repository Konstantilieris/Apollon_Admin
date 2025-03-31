"use client";

import React from "react";
import { Input, DateRangePicker, Button } from "@heroui/react";

import type { RangeValue } from "@react-types/shared";
import type { DateValue } from "@react-types/datepicker";
import { I18nProvider } from "@react-aria/i18n";
import { Icon } from "@iconify/react";

interface ServicesFiltersProps {
  onDateRangeChange: (range: RangeValue<DateValue> | null) => void;
  onAmountFilterChange: (min: string, max: string) => void;
}

export function ServicesFilters({
  onDateRangeChange,
  onAmountFilterChange,
}: ServicesFiltersProps) {
  const [minAmount, setMinAmount] = React.useState("");
  const [maxAmount, setMaxAmount] = React.useState("");
  const [dateRange, setDateRange] =
    React.useState<RangeValue<DateValue> | null>(null);

  const handleMinAmountChange = (value: string) => {
    setMinAmount(value);
    onAmountFilterChange(value, maxAmount);
  };

  const handleMaxAmountChange = (value: string) => {
    setMaxAmount(value);
    onAmountFilterChange(minAmount, value);
  };

  const handleDateChange = (range: RangeValue<DateValue> | null) => {
    setDateRange(range);
    onDateRangeChange(range);
  };

  const handleClearAll = () => {
    setMinAmount("");
    setMaxAmount("");
    setDateRange(null);
    onAmountFilterChange("", "");
    onDateRangeChange(null);
  };

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end">
      <I18nProvider locale="el-GR">
        <DateRangePicker
          label="Εύρος Ημερομηνιών"
          value={dateRange}
          onChange={handleDateChange}
          className="max-w-xs"
          classNames={{
            calendar: "rounded-lg font-sans text-base",
            label: "font-sans text-base",
            input: "font-sans text-light-900",
            calendarContent: "font-sans text-base",
            selectorButton: "font-sans text-light-900",
            selectorIcon: "font-sans text-light-900",
            segment: "font-sans text-gray-400",
            base: "font-sans text-light-900",
            popoverContent: "font-sans text-light-900 text-base",
            separator: "font-sans text-light-900",
          }}
        />
      </I18nProvider>

      <div className="flex flex-1 gap-4">
        <Input
          type="number"
          label="Να είναι τουλάχιστον"
          placeholder="0"
          value={minAmount}
          onValueChange={handleMinAmountChange}
          startContent={<span className="text-default-400">€</span>}
        />
        <Input
          type="number"
          label="Να είναι το πολύ"
          placeholder="10000"
          value={maxAmount}
          onValueChange={handleMaxAmountChange}
          startContent={<span className="text-default-400">€</span>}
        />
      </div>

      <Button
        isIconOnly
        variant="flat"
        color="danger"
        onPress={handleClearAll}
        isDisabled={!dateRange && !minAmount && !maxAmount}
        aria-label="Καθαρισμός φίλτρων"
      >
        <Icon icon="lucide:x" className="h-4 w-4" />
      </Button>
    </div>
  );
}
