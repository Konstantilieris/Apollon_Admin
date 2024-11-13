"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";
const SelectYear: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [year, setYear] = useState(
    searchParams.get("year") ?? new Date().getFullYear()
  );
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - i);
  const handleChange = (value: string) => {
    const selectedYear = value;
    setYear(Number(selectedYear));
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "year",
      value: selectedYear,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <Select onValueChange={handleChange} value={year.toString()}>
      <SelectTrigger className="absolute right-2 top-2 w-[180px]">
        <SelectValue placeholder="Διάλεξε ημερομηνία" />
      </SelectTrigger>
      <SelectContent className="max-h-[230px] bg-dark-100 font-sans text-lg text-light-900">
        <SelectGroup>
          <SelectLabel>Χρονολογία</SelectLabel>
          {years.map((year) => (
            <SelectItem
              key={year}
              value={year.toString()}
              className="hover:scale-105"
            >
              {year}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectYear;
