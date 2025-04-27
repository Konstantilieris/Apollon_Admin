// components/FiltersPayments.tsx
import DatePushUrl from "@/components/datepicker/DatePushUrl";
import LocalSearch from "@/components/shared/searchBar/LocalSearch";

import { Select, SelectItem } from "@heroui/select";
import React from "react";
import { useUrlReversedFilter } from "@/hooks/useUrlReversedFilter";

const FiltersPayments = () => {
  const { reversedFilter, setReversedFilter } = useUrlReversedFilter();
  return (
    <div className="border-b border-divider p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <LocalSearch placeholder="Αναζήτηση πελάτη..." />
        </div>

        <div className="w-full md:w-48">
          <Select
            label="Κατάσταση"
            selectedKeys={reversedFilter ? [reversedFilter] : []}
            defaultSelectedKeys={["notReversed"]}
            onChange={(e) =>
              setReversedFilter(e.target.value as "reversed" | "notReversed")
            }
            classNames={{
              label: "text-base tracking-wide",
              popoverContent: "font-sans text-base",
            }}
            size="sm"
          >
            <SelectItem key="notReversed">ΕΓΚΥΡΕΣ</SelectItem>
            <SelectItem key="reversed">ΑΚΥΡΩΜΕΝΕΣ</SelectItem>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <DatePushUrl />
        </div>
      </div>
    </div>
  );
};

export default FiltersPayments;
