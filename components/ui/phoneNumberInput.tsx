"use client";
import React from "react";
import { Input } from "@/components/ui/input"; // Assuming Input from shadcn is being used
interface PhoneProps {
  placeholder: string | undefined;
  value: string;
  setValue: any;
}
export const PhoneNumberInput = ({
  placeholder,
  value,
  setValue,
}: PhoneProps) => {
  // Function to format phone number as (xxx) xxx-xxxx
  const formatPhoneNumber = (input: string) => {
    // Remove all non-numeric characters
    const cleaned = input.replace(/\D/g, "");

    // Restrict the length to 10 digits (assuming US phone numbers)
    const limited = cleaned.slice(0, 10);

    return limited;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setValue(formattedValue);
  };

  return (
    <Input
      placeholder={placeholder}
      type="tel"
      value={value}
      onChange={handleChange}
      className="shad-input border-0"
    />
  );
};
