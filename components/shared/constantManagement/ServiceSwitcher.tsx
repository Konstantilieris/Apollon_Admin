"use client";
import React from "react";

import { ChevronsUpDown, Check } from "lucide-react";

import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { IconCirclePlus, IconTopologyStar2 } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";

type ConstantProps = {
  items: { value: string }[];
  className?: string;
  type: string;
  label: string;
  placeholder: string;
  heading: string;
  selectedItem: string | null;
  setSelectedItem: (value: string) => void;
  setAmount: (value: string) => void;
  client: any;
};

const ServiceSwitcher = ({
  items,
  className,
  type,
  label,
  placeholder,
  heading,
  selectedItem,
  client,
  setAmount,
  setSelectedItem,
}: ConstantProps) => {
  const [open, setOpen] = React.useState(false);

  const [isNew, setIsNew] = React.useState(false);
  const formattedItems = items.map((value: any) => ({
    label: value,
    value,
  }));

  const onConstantSelect = (value: string) => {
    // Debug log
    setOpen(false);
    setSelectedItem(value);
  };
  const servicePreference = client.serviceFees.filter((service: any) =>
    client.servicePreferences.includes(service.type)
  );
  console.log(selectedItem);
  return (
    <>
      {isNew ? (
        <Input
          type="text"
          value={selectedItem || ""}
          onChange={(e) => setSelectedItem(e.target.value)}
          className="text-dark100_light900  font-bold focus-visible:outline-none dark:bg-dark-100"
        />
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                "w-full justify-between bg-light-900 dark:border-dark-500 dark:bg-dark-100 flex flex-row items-center min-h-[6vh]",
                className
              )}
              size="lg"
              role="combobox"
              aria-expanded={open}
              aria-label="Select a store"
            >
              <IconTopologyStar2 className="mr-2 h-4 w-4" />
              {selectedItem || placeholder}
              <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[270px] p-0  font-sans dark:bg-dark-200">
            <Command>
              <CommandList>
                <CommandGroup heading="Προτιμήσεις" className="text-yellow-500">
                  {servicePreference.map((service: any) => (
                    <CommandItem
                      key={service.type}
                      value={service.type}
                      onSelect={() => {
                        onConstantSelect(service.type);
                        setAmount(service.value);
                      }}
                      className="text-sm hover:scale-105 dark:text-light-700"
                    >
                      <IconTopologyStar2 className="mr-2 h-4 w-4" />{" "}
                      {service.type}
                      <Check
                        className={cn("ml-auto h-4 w-4", {
                          "opacity-0": service.type !== selectedItem,
                          "opacity-100": service.type === selectedItem,
                        })}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
              <CommandList className="custom-scrollbar">
                <CommandInput placeholder={placeholder} />
                <CommandEmpty>Δεν βρέθηκε.</CommandEmpty>
                <CommandGroup heading={heading} className="text-yellow-500">
                  {formattedItems.map((item: any) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={() => {
                        onConstantSelect(item.value);
                      }}
                      className="text-sm hover:scale-105 dark:text-light-700"
                    >
                      <IconTopologyStar2 className="mr-2 h-4 w-4" />{" "}
                      {item.value}
                      <Check
                        className={cn("ml-auto h-4 w-4", {
                          "opacity-0": item.value !== selectedItem,
                          "opacity-100": item.value === selectedItem,
                        })}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
              <CommandSeparator />
              <CommandList>
                <CommandGroup heading="ΕΝΕΡΓΕΙΕΣ" className="text-yellow-500">
                  <CommandItem
                    value="Δημιουργια"
                    className="flex flex-row items-center  font-semibold text-green-400 hover:scale-105 hover:animate-pulse"
                    onSelect={() => {
                      setIsNew(true);
                      setOpen(false);
                    }}
                  >
                    <IconCirclePlus className="mr-2 h-5 w-5 text-green-400" />
                    ΝΕΑ ΠΡΟΣΘΗΚΗ
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export default ServiceSwitcher;
