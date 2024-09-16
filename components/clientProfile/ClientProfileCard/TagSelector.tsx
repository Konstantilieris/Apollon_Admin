"use client";
import React, { useEffect } from "react";

import { Check } from "lucide-react";
import { useConstantModal } from "@/hooks/use-constant-modal";

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

import {
  IconCirclePlus,
  IconSettings,
  IconSchool,
  IconDog,
  IconDogBowl,
  IconEyeCheck,
  IconTag,
  IconUserPlus,
} from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type ConstantProps = {
  items: { value: string }[];
  className?: string;
  type: string;
  label: string;
  placeholder: string;
  heading: string;
  selectedItem: string | null;
  setSelectedItem: (value: string) => void;
  handleSelectTag: () => void;
};

const TagSelector = ({
  items,
  className,
  type,
  label,
  placeholder,
  heading,
  selectedItem,
  handleSelectTag,
  setSelectedItem,
}: ConstantProps) => {
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

  const onConstantSelect = (value: string) => {
    // Debug log

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
      case "Tags":
        return <IconTag className="mr-2 h-6 w-6" />;
      default:
        return <IconSettings className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <Command className="min-w-[15vw] max-h-[40vh] font-sans bg-dark-100/90 ">
      <CommandList className=" ">
        <CommandInput placeholder={placeholder} />
        <CommandEmpty>Δεν βρέθηκε.</CommandEmpty>

        <CommandGroup heading={heading} className="text-indigo-400 ">
          <ScrollArea className="max-h-[15vh] overflow-y-auto">
            {formattedItems.map((item: { label: string; value: string }) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={() => {
                  onConstantSelect(item.value);
                }}
                className="text-sm font-semibold uppercase tracking-widest hover:scale-105 dark:text-light-900"
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
          </ScrollArea>
        </CommandGroup>
      </CommandList>
      <CommandSeparator />
      <CommandList>
        <CommandGroup heading="ΕΝΕΡΓΕΙΕΣ" className=" text-light-900">
          <CommandItem
            value="Πελάτης"
            className=" flex flex-row items-center  font-semibold text-light-800 hover:scale-105 disabled:text-red-500"
            disabled={!selectedItem}
            onSelect={() => {
              handleSelectTag();
            }}
          >
            <IconUserPlus className="mr-2 h-7 w-7 text-light-800 " />
            ΠΡΟΣΘΗΚΗ ΣΤΟΝ ΠΕΛΑΤΗ
          </CommandItem>
          <CommandItem
            value="Δημιουργια"
            className=" flex flex-row items-center  font-semibold text-light-800 hover:scale-105 "
            disabled={false}
            onSelect={() => {
              // Debug log

              onOpen(type, label);
            }}
          >
            <IconCirclePlus className="mr-2 h-6 w-6 text-light-800 " />
            ΝΕΑ ΠΡΟΣΘΗΚΗ
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default TagSelector;
