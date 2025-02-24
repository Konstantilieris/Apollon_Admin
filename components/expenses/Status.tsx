import React, { forwardRef, memo } from "react";
import { cn } from "@heroui/react";

import { expenseStatusColorMap, type ExpenseStatus } from "./data";

export interface StatusProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  status: ExpenseStatus;
}

export const Status = memo(
  forwardRef<HTMLDivElement, StatusProps>((props, forwardedRef) => {
    const { className, status } = props;
    const statusColor = expenseStatusColorMap[status];
    const statusText =
      status === "pending"
        ? "Εκκρεμής"
        : status === "paid"
          ? "Πληρωμένο"
          : "Ληξιπρόθεσμο";
    return (
      <div
        ref={forwardedRef}
        className={cn(
          "flex w-fit items-center gap-[2px] rounded-lg bg-default-100 px-2 py-1",
          className
        )}
      >
        {statusColor}
        <span className="px-1 text-default-800">{statusText}</span>
      </div>
    );
  })
);

Status.displayName = "Status";
