"use client";
import React, { useEffect } from "react";

import { ChevronsUpDown, Check } from "lucide-react";
import { useConstantModal } from "@/hooks/use-constant-modal";
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
import {
  IconCirclePlus,
  IconSettings,
  IconSchool,
  IconDog,
  IconDogBowl,
  IconEyeCheck,
} from "@tabler/icons-react";

type ConstantProps = {
  items: { value: string }[];
  className?: string;
  type: string;
  label: string;
  placeholder: string;
  heading: string;
  selectedItem: string | null;
  setSelectedItem: (value: string) => void;
};

const ConstantSwitcher = ({
  items,
  className,
  type,
  label,
  placeholder,
  heading,
  selectedItem,
  setSelectedItem,
}: ConstantProps) => {
  const [open, setOpen] = React.useState(false);
  const [localItems, setLocalItems] = React.useState<any>(items);
  const { onOpen, newConstant, resetNewConstant } = useConstantModal();

  useEffect(() => {
    if (newConstant && newConstant.type === type) {
      // Normalize localItems to have a consistent format
      const normalizedItems = localItems.map((item: any) =>
        typeof item === "string" ? { value: item } : item
      );

      // Check if the newConstant already exists in normalizedItems
      const exists = normalizedItems.some(
        (item: any) => item.value === newConstant
      );

      if (!exists) {
        // Add new constant optimistically
        setLocalItems((prevItems: any) => [...prevItems, newConstant.value]);
        setSelectedItem(newConstant.value!); // Optionally select the new constant
      }

      // Reset the newConstant
      resetNewConstant();
    }
  }, [newConstant]);

  const formattedItems = localItems.map((value: any) => ({
    label: value,
    value,
  }));

  const currentItem = formattedItems.find(
    (item: any) => item.value === selectedItem
  );
  const onConstantSelect = (value: string) => {
    // Debug log
    setOpen(false);
    setSelectedItem(value);
  };
  const renderIcons = (type: string) => {
    switch (type) {
      case "Professions":
        return <IconSchool className="mr-2 h-4 w-4" />;
      case "Breeds":
        return <IconDog className="mr-2 h-4 w-4" />;

      case "Behaviors":
        return <IconEyeCheck className="mr-2 h-4 w-4" />;

      case "Foods":
        return <IconDogBowl className="mr-2 h-4 w-4" />;
      default:
        return <IconSettings className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-full justify-between  bg-light-900 dark:border-dark-500 dark:bg-dark-400 flex flex-row items-center ",
            className
          )}
          size="lg"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
        >
          {renderIcons(type)}
          {currentItem?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[270px] p-0 font-sans dark:bg-dark-200">
        <Command>
          <CommandList className="custom-scrollbar">
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>Δεν βρέθηκε.</CommandEmpty>
            <CommandGroup heading={heading} className="text-indigo-400">
              {formattedItems.map((item: { label: string; value: string }) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => {
                    onConstantSelect(item.value);
                  }}
                  className="text-sm hover:scale-105 dark:text-light-700"
                >
                  {renderIcons(type)} {item.value}
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
            <CommandGroup heading="ΕΝΕΡΓΕΙΕΣ" className="text-green-500">
              <CommandItem
                value="Δημιουργια"
                className="flex flex-row items-center font-sans font-semibold text-green-400 hover:scale-105 hover:animate-pulse"
                disabled={false}
                onSelect={() => {
                  // Debug log
                  setOpen(false);
                  onOpen(type, label);
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
  );
};

export default ConstantSwitcher;
