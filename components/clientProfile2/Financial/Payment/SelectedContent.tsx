import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatCurrency } from "@/lib/utils";

interface TableBulkActionsProps {
  selectedIds: any;
  onBulkAction: (action: string) => void;
  selectedCount: number;
  selectedTotalAmount: number;
}

export const TableBulkActions: React.FC<TableBulkActionsProps> = ({
  selectedIds,
  onBulkAction,
  selectedCount,
  selectedTotalAmount,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-divider bg-dark-100/40 p-2">
      <div className="flex items-center gap-2 pl-2">
        <span className="text-sm font-medium">
          Επιλεγμένες Πληρωμές ({selectedCount}{" "}
          {selectedCount === 1 ? "πληρωμή" : "πληρωμές"})
        </span>
        <span className="text-large font-semibold text-primary-500">
          {formatCurrency(selectedTotalAmount)}
        </span>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          color="primary"
          variant="flat"
          startContent={<Icon icon="lucide:rotate-ccw" />}
          onPress={() => onBulkAction("reverse")}
          isDisabled={selectedCount === 0}
          className="text-base"
        >
          Ακύρωση
        </Button>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          startContent={<Icon icon="lucide:download" />}
          onPress={() => onBulkAction("export")}
          isDisabled={selectedCount === 0}
          className="text-base"
        >
          Εκτύπωση
        </Button>
        <Button
          size="sm"
          color="danger"
          variant="flat"
          startContent={<Icon icon="lucide:trash-2" />}
          onPress={() => onBulkAction("delete")}
          isDisabled={selectedCount === 0}
          className="text-base"
        >
          Διαγραφή
        </Button>
      </div>
    </div>
  );
};
