"use client";
import React from "react";
import { Icon } from "@iconify/react";
import {
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Button,
  Chip,
} from "@heroui/react";
import { useUrlDateRange } from "@/hooks/useUrlDateRange";
import { useUrlFlagFilters } from "@/hooks/useUrlFlagFilters";
import moment from "moment";
import LocalSearch from "../shared/searchBar/LocalSearch";
import DatePushUrl from "../datepicker/DatePushUrl";

interface TopContentProps {
  hasSelection: boolean;
  selectedKeys: Set<string>;
  totalSelectedAmount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Supported single‑select filters
// ─────────────────────────────────────────────────────────────────────────────
const PRESET_FILTERS = [
  { key: "today", label: "Σήμερα", icon: "lucide:calendar-days" },
  {
    key: "week",
    label: "Αυτή την Εβδομάδα",
    icon: "lucide:calendar-range",
  },
  { key: "month", label: "Αυτόν τον Μήνα", icon: "lucide:calendar" },
  { key: "flag1", label: "Μόνο Άφιξη PetTaxi", icon: "lucide:car" },
  { key: "flag2", label: "Μόνο Αναχώρηση PetTaxi", icon: "lucide:car" },
] as const;

type FilterKey = (typeof PRESET_FILTERS)[number]["key"];

/*
 ────────────────────────────────────────────────────────────────────────────────
 📝  TopContent Component – **single‑select filters with toggle‑off**
     • Selecting a new filter first clears the old one.
     • Clicking the active filter again removes it (URL params cleared).
*/
const TopContent: React.FC<TopContentProps> = ({
  hasSelection,
  selectedKeys,
  totalSelectedAmount,
}) => {
  // URL‑synced hooks
  const { rangeDate, setRangeDate } = useUrlDateRange();
  const { flag1, flag2, setFlag1, setFlag2 } = useUrlFlagFilters();

  // currently active filter key (only ONE allowed at a time)
  const [currentFilter, setCurrentFilter] = React.useState<FilterKey | null>(
    null
  );

  /* ──────────────────────────────────────────────────────────────────────
     🔄  Util – clear *all* date & flag filters
  */
  const clearFilters = React.useCallback(() => {
    setCurrentFilter(null);
    setRangeDate({ from: undefined, to: undefined });
    setFlag1(false);
    setFlag2(false);
  }, [setRangeDate, setFlag1, setFlag2]);

  /* ──────────────────────────────────────────────────────────────────────
     📅  Apply quick date preset (today / week / month)
  */
  const applyDatePreset = (preset: "today" | "week" | "month") => {
    const today = moment();
    if (preset === "today") {
      setRangeDate({
        from: today.startOf("day").toDate(),
        to: today.endOf("day").toDate(),
      });
    } else if (preset === "week") {
      setRangeDate({
        from: today.startOf("week").toDate(),
        to: today.endOf("week").toDate(),
      });
    } else if (preset === "month") {
      setRangeDate({
        from: today.startOf("month").toDate(),
        to: today.endOf("month").toDate(),
      });
    }
  };

  /* ──────────────────────────────────────────────────────────────────────
     🎛️  Handle filter click – supports *toggle‑off* + single‑select
  */
  const handleFilterSelect = (key: React.Key) => {
    const k = key as string as FilterKey;

    // 🔄 toggle‑off
    if (k === currentFilter) {
      clearFilters();
      return;
    }

    // ✅ apply a NEW filter → clear previous first
    clearFilters();
    setCurrentFilter(k);

    if (k === "flag1") {
      setFlag1(true);
    } else if (k === "flag2") {
      setFlag2(true);
    } else {
      applyDatePreset(k);
    }
  };

  /* ──────────────────────────────────────────────────────────────────────
     🔢  Active‑filter badge
  */
  const activeFilters = (() => {
    let c = 0;
    if (rangeDate.from && rangeDate.to) c++;
    if (flag1) c++;
    if (flag2) c++;
    return c;
  })();

  /* ──────────────────────────────────────────────────────────────────────
     🖼️  Render
  */
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* 🔍 Search + custom date picker */}
      <div className="flex w-full gap-2 md:max-w-[44%]">
        <LocalSearch placeholder="Αναζήτηση πελάτη..." />
        <DatePushUrl />
      </div>

      {/* 📋 Action area */}
      <div className="flex items-center gap-4">
        {hasSelection && (
          <div className="flex w-full items-center gap-2 px-2">
            <Chip
              color="secondary"
              variant="flat"
              size="sm"
              className="text-base tracking-widest"
            >
              Σύνολο: €{totalSelectedAmount.toFixed(2)}
            </Chip>
            <Button
              color="danger"
              variant="flat"
              className="text-base"
              size="sm"
              startContent={<Icon icon="lucide:trash" className="h-4 w-4" />}
              onPress={() => {
                /* TODO delete logic */
              }}
            >
              Διαγραφή {selectedKeys.size} επιλεγμένων
            </Button>
          </div>
        )}

        {/* ▼ Dropdown Filters */}
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="bordered"
              color="secondary"
              startContent={
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:filter" />
                  {activeFilters > 0 && (
                    <Chip
                      size="sm"
                      color="primary"
                      variant="flat"
                      className="min-w-5 h-5 px-1"
                    >
                      {activeFilters}
                    </Chip>
                  )}
                </div>
              }
              className="min-h-[55px] min-w-[120px] text-base"
            >
              Φίλτρα
            </Button>
          </DropdownTrigger>

          <DropdownMenu
            onAction={(key) => handleFilterSelect(key)}
            selectedKeys={currentFilter ? new Set([currentFilter]) : new Set()}
            selectionMode="single"
            className="min-w-[240px]"
            classNames={{
              base: "p-0",
              list: "gap-0 divide-y divide-default-200",
            }}
          >
            {PRESET_FILTERS.map(({ key, label, icon }) => (
              <DropdownItem
                key={key}
                className=" data-[selected=true]:text-primary-500"
                classNames={{
                  base: "flex items-center gap-2 px-4 py-2 text-base font-sans",
                }}
                startContent={<Icon icon={icon} className="h-5 w-5" />}
              >
                <span className="text-base">{label}</span>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default TopContent;
