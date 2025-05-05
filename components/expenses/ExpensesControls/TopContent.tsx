"use client";

import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import LocalSearch from "../../shared/searchBar/LocalSearch";
import { expenseColumns } from "../data";
import { Icon } from "@iconify/react";
import { useExpensesStore } from "@/hooks/expenses-store";
import PaymentMethod from "./RadioGroups/PaymentMethod";
import ExpenseStatus from "./RadioGroups/ExpenseStatus";
import DateFiltering from "./RadioGroups/DateFiltering";
import SortingColumns from "./SortingControl/SortingColumns";
import RowsPerPageSelector from "./PageControl/RowsPerPageSelector";

interface TopContentProps {
  visibleColumns: any;
  setVisibleColumns: (keys: any) => void;
  headerColumns: { uid: string; name: string }[];
  filterSelectedKeys: any;
  initialData: any[];
  totalAmount: number;
}

const TopContent: React.FC<TopContentProps> = ({
  visibleColumns,
  setVisibleColumns,
  headerColumns,
  filterSelectedKeys,
  initialData,
  totalAmount,
}) => {
  const { setType, setIsOpen } = useExpensesStore();

  return (
    <div className="flex flex-col justify-between gap-4">
      {/* --- upper bar --- */}
      <div className="flex items-center gap-4 overflow-auto px-[6px] py-[4px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4">
            {/* search */}
            <LocalSearch placeholder="Αναζήτηση..." />

            {/* filters popover */}
            <Popover placement="bottom">
              <PopoverTrigger>
                <Button
                  className="bg-default-100 text-base tracking-widest text-default-800"
                  size="lg"
                  startContent={
                    <Icon
                      icon="solar:tuning-2-linear"
                      width={16}
                      className="text-default-400"
                    />
                  }
                >
                  Φίλτρα
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex w-full flex-col gap-6 px-2 py-4">
                  <PaymentMethod />
                  <ExpenseStatus />
                  <DateFiltering />
                </div>
              </PopoverContent>
            </Popover>

            {/* sorting dropdown (URL‑synced) */}
            <SortingColumns headerColumns={headerColumns} />

            {/* column visibility dropdown */}
            <Dropdown closeOnSelect={false}>
              <DropdownTrigger>
                <Button
                  className="bg-default-100 tracking-widest  text-default-800"
                  size="lg"
                  startContent={
                    <Icon
                      icon="solar:sort-horizontal-linear"
                      width={16}
                      className="text-base text-default-400"
                    />
                  }
                >
                  Στήλες
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Columns"
                items={expenseColumns
                  .filter((c) => !["actions"].includes(c.uid))
                  .map((i) => ({ ...i, key: i.uid }))}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
                className="font-sans tracking-wide"
              >
                {(item) => (
                  <DropdownItem key={item.uid}>{item.name}</DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* divider & selection summary */}
          <Divider className="h-5" orientation="vertical" />

          <div className="whitespace-nowrap text-base tracking-wide text-default-800 ">
            {filterSelectedKeys === "all"
              ? "Όλα Επιλεγμένα"
              : `${filterSelectedKeys.size} Επιλεγμένα`}
          </div>

          {/* bulk actions */}
          {(filterSelectedKeys === "all" || filterSelectedKeys.size > 0) && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="bg-default-100 text-default-800"
                  endContent={
                    <Icon
                      icon="solar:alt-arrow-down-linear"
                      className="text-default-400"
                    />
                  }
                  size="sm"
                  variant="flat"
                >
                  Επιλεγμένες Ενέργειες
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Selected Actions"
                className="font-sans tracking-wide"
              >
                <DropdownItem
                  key="delete-expense"
                  onPress={() => {
                    setType("delete");
                    setIsOpen(true);
                  }}
                >
                  ΔΙΑΓΡΑΦΗ ΕΞΟΔΩΝ
                </DropdownItem>
                <DropdownItem key="mark-paid">ΠΛΗΡΩΘΗΚΕ</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>

      {/* --- lower bar --- */}
      <div className="flex items-center justify-between">
        <span className="text-small text-default-400">
          Σύνολο {initialData.length} δαπανών {totalAmount} €
        </span>
        <RowsPerPageSelector />
      </div>
    </div>
  );
};

export default TopContent;
