"use client";
import { resetHours } from "@/lib/utils";
import { addDays } from "date-fns";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "./DateRangePicker";
import { Button } from "../ui/button";

const DateRangeUrl = () => {
  const [rangeDate, setRangeDate] = useState<DateRange>({
    from: resetHours(new Date()),
    to: addDays(resetHours(new Date()), 1),
  });
  const update = () => {};
  return (
    <>
      <DatePickerWithRange rangeDate={rangeDate} setRangeDate={setRangeDate} />
      <Button onClick={update}> </Button>
    </>
  );
};

export default DateRangeUrl;
