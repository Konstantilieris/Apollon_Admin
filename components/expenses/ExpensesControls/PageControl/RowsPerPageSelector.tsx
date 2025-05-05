"use client";
import React from "react";
import { useUrlRowsPerPage } from "@/hooks/useUrlRowsPerPage";

const RowsPerPageSelector: React.FC = () => {
  const { rowsPerPage, onRowsPerPageChange } = useUrlRowsPerPage();

  return (
    <label className="flex items-center text-small text-default-400">
      Γραμμές ανά σελίδα
      <select
        className="bg-neutral-900 font-sans text-base text-default-400 outline-none"
        onChange={onRowsPerPageChange}
        value={rowsPerPage}
      >
        {[5, 10, 15, 20, 25].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );
};

export default RowsPerPageSelector;
