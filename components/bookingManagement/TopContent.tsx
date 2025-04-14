"use client";
import React from "react";
import { Icon } from "@iconify/react";
import {
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Button,
} from "@heroui/react";

import { useUrlDateRange } from "@/hooks/useUrlDateRange";
import { useUrlFlagFilters } from "@/hooks/useUrlFlagFilters";
import moment from "moment";
import LocalSearch from "../shared/searchBar/LocalSearch";
import DatePushUrl from "../datepicker/DatePushUrl";

const TopContent = ({ hasSelection, selectedKeys }: any) => {
  const { setRangeDate } = useUrlDateRange();
  const { setFlag1, setFlag2 } = useUrlFlagFilters();

  const handleDropdownFilter = (key: string) => {
    const today = moment();

    switch (key) {
      case "today":
        setRangeDate({
          from: today.startOf("day").toDate(),
          to: today.endOf("day").toDate(),
        });
        break;
      case "week":
        setRangeDate({
          from: today.startOf("week").toDate(),
          to: today.endOf("week").toDate(),
        });
        break;
      case "month":
        setRangeDate({
          from: today.startOf("month").toDate(),
          to: today.endOf("month").toDate(),
        });
        break;
      case "flag1":
        setFlag1(true);
        setFlag2(false);
        break;
      case "flag2":
        setFlag1(false);
        setFlag2(true);
        break;
      case "all":
      default:
        setRangeDate({ from: undefined, to: undefined });
        setFlag1(false);
        setFlag2(false);
        break;
    }
  };
  const handleDelete = () => {};
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* 🔍 Αναζήτηση */}
      <div className="flex w-full md:max-w-[44%]">
        <LocalSearch placeholder="Αναζήτηση πελάτη..." />
        {hasSelection && (
          <div className="flex w-full items-center gap-2 px-2">
            <Button
              color="danger"
              variant="flat"
              className="text-base"
              size="sm"
              startContent={<Icon icon="lucide:trash" className="h-4 w-4" />}
              onPress={handleDelete}
            >
              Διαγραφή {selectedKeys.size} επιλεγμένων
            </Button>
          </div>
        )}
      </div>

      {/* 📅 Επιλογή Ημερομηνιών */}
      <div className="flex items-center gap-4">
        <DatePushUrl />

        {/* ⬇️ Επιλογές Φίλτρου */}
        <Dropdown
          classNames={{
            base: "font-sans text-light-900 tracking-wide text-base",
          }}
        >
          <DropdownTrigger>
            <Button
              variant="bordered"
              color="secondary"
              startContent={<Icon icon="lucide:filter" />}
              className="min-h-[55px] min-w-[120px]"
            >
              Φίλτρα
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Επιλογές Φίλτρων"
            onAction={(key) => handleDropdownFilter(key as string)}
          >
            <DropdownItem key="all">Όλες οι Ημερομηνίες</DropdownItem>
            <DropdownItem key="today">Σήμερα</DropdownItem>
            <DropdownItem key="week">Αυτή την Εβδομάδα</DropdownItem>
            <DropdownItem key="month">Αυτόν τον Μήνα</DropdownItem>
            <DropdownItem key="flag1">Μόνο Άφιξη PetTaxi</DropdownItem>
            <DropdownItem key="flag2">Μόνο Αναχώρηση PetTaxi</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default TopContent;
