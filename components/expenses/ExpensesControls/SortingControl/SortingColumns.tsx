"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

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
          className="bg-default-100  text-base tracking-wide text-default-800"
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
