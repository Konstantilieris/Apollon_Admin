"use client";

import React from "react";
import { Input } from "@heroui/react"; // Assuming you're using a UI library that provides an Input component
import { useUrlSearchQuery } from "@/hooks/useUrlSearchQuery"; // <-- the hook we built

interface CustomInputProps {
  placeholder: string;
  otherClasses?: string;
}

const LocalSearch = ({ placeholder, otherClasses }: CustomInputProps) => {
  const { searchTerm, setSearchTerm } = useUrlSearchQuery();

  return (
    <Input
      type="text"
      className="max-w-[30vw] md:max-w-[40vw] lg:max-w-[30vw]"
      label={placeholder}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      variant="bordered"
      color="default"
    />
  );
};

export default LocalSearch;
