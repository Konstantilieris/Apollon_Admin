"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useUrlSortDescriptor } from "@/hooks/useUrlSortDescriptor";

interface Props {
  headerColumns: { uid: string; name: string }[];
}

const SortingColumns: React.FC<Props> = ({ headerColumns }) => {
  const { setSortDescriptor } = useUrlSortDescriptor();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          size="lg"
          className="bg-default-100 text-base tracking-widest text-default-800"
          startContent={
            <Icon
              icon="solar:sort-linear"
              width={16}
              className="text-default-400"
            />
          }
        >
          Ταξινόμηση
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Sort"
        items={headerColumns.filter((c) => !["actions"].includes(c.uid))}
        className="font-sans tracking-wide"
      >
        {(item) => (
          <DropdownItem
            key={item.uid}
            onPress={() =>
              setSortDescriptor((prev) => ({
                column: item.uid,
                direction:
                  prev.column === item.uid && prev.direction === "ascending"
                    ? "descending"
                    : "ascending",
              }))
            }
          >
            {item.name}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default SortingColumns;
