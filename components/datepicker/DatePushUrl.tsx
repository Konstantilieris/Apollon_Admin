"use client";

import React from "react";
import { DateRangePicker, RangeValue } from "@heroui/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import type { DateValue } from "@react-types/datepicker";

import { useUrlDateRange } from "@/hooks/useUrlDateRange";

export default function DatePushUrl({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const { rangeDate, setRangeDate } = useUrlDateRange();

  const toHeroDate = (date?: Date): DateValue | undefined =>
    date ? parseDate(date.toISOString().slice(0, 10)) : undefined;

  const fromHeroDate = (val?: DateValue): Date | undefined =>
    val ? val.toDate(getLocalTimeZone()) : undefined;

  const datePickerValue: RangeValue<DateValue> | null =
    rangeDate.from && rangeDate.to
      ? {
          start: toHeroDate(rangeDate.from)!,
          end: toHeroDate(rangeDate.to)!,
        }
      : null; // 👈 default to null if no range set

  return (
    <div className="flex flex-col gap-2">
      <I18nProvider locale="el-GR">
        <DateRangePicker
          label="Εύρος Ημερομηνιών"
          visibleMonths={2}
          showMonthAndYearPickers
          color="secondary"
          variant="bordered"
          value={datePickerValue}
          onChange={(val: RangeValue<DateValue> | null) => {
            setRangeDate({
              from: fromHeroDate(val?.start),
              to: fromHeroDate(val?.end),
            });
          }}
          isDisabled={disabled}
          classNames={{
            calendar: "rounded-lg font-sans text-base",
            label: "font-sans text-base",
            input: "font-sans text-light-900",
            inputWrapper: "font-sans text-lg ",
            calendarContent: "font-sans text-base",
            selectorButton: "font-sans  text-light-900",
            selectorIcon: "font-sans text-light-900",
            segment: "font-sans text-gray-400",
            base: "font-sans text-light-900",
            popoverContent: "font-sans text-light-900 text-base",
            separator: "font-sans text-light-900",
          }}
        />
      </I18nProvider>
    </div>
  );
}
