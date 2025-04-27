import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatCurrency } from "@/lib/utils";

interface TableTopContentProps {
  totalAmount: number;
  selectedIds: any;

  openCreatePaymentModal: any;
  hasSelection: boolean;
  selectedCount: number;
}

export const TableTopContent: React.FC<TableTopContentProps> = ({
  totalAmount,
  selectedIds,

  openCreatePaymentModal,
  hasSelection,
  selectedCount,
}) => {
  return (
    <div className="flex flex-col gap-2 border-b border-divider p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1">
        <span className="text-base tracking-widest text-default-500">
          Συνολικές Πληρωμές
        </span>
        <span className="text-large font-semibold">
          {formatCurrency(totalAmount)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          color="success"
          variant="bordered"
          startContent={<Icon icon="lucide:plus" />}
          onPress={() => {
            openCreatePaymentModal(true);
          }}
          className="text-base tracking-widest"
        >
          Νέα Πληρωμή
        </Button>
      </div>
    </div>
  );
};
