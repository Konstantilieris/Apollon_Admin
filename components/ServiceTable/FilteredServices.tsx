// components/FiltersPayments.tsx
import DatePushUrl from "@/components/datepicker/DatePushUrl";
import LocalSearch from "@/components/shared/searchBar/LocalSearch";

import { Select, SelectItem } from "@heroui/select";
import React from "react";
import { useUrlPaidFilter } from "@/hooks/useUrlPaidFilter";

const FiltersServices = () => {
  const { paidFilter, setPaidFilter } = useUrlPaidFilter();
  return (
    <div className="border-b border-divider p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <LocalSearch placeholder="Αναζήτηση πελάτη..." />
        </div>

        <div className="w-full md:w-48">
          <Select
            label="Κατάσταση"
            selectedKeys={paidFilter ? [paidFilter] : []}
            defaultSelectedKeys={["unpaid"]}
            onChange={(e) => setPaidFilter(e.target.value as "paid" | "unpaid")}
            classNames={{
              label: "text-base tracking-wide",
              popoverContent: "font-sans text-base",
            }}
            size="sm"
          >
            <SelectItem key="unpaid">ΟΦΕΙΛΩΜΕΝΑ</SelectItem>
            <SelectItem key="paid">ΠΛΗΡΩΜΕΝΕΣ</SelectItem>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <DatePushUrl />
        </div>
      </div>
    </div>
  );
};

export default FiltersServices;
