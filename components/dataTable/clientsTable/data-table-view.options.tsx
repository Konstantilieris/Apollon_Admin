"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  options: { label: string; title: string; value: string | string[] }[];
}

export function DataTableViewOptions<TData>({
  table,
  options,
}: DataTableViewOptionsProps<TData>) {
  const checkHandler = (value: boolean, column: any) => {
    column.toggleVisibility(!!value);
    column.columns.map((item: any) => item.toggleVisibility(!!value));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          className="ml-auto hidden h-10 border border-black font-sans font-bold hover:scale-110 dark:border-white lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          Όψη
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="background-light900_dark300 text-dark200_light800 w-[150px] text-center"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel>Εναλλαγή Στηλών</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.id === "Dog")
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className=" flex items-center gap-2 capitalize hover:bg-fuchsia-500"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => checkHandler(value, column)}
              >
                {column.id === options[0].label && options[0].title}
                <Image
                  src={"/assets/icons/dog.svg"}
                  width={20}
                  height={20}
                  alt="dog"
                />
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
