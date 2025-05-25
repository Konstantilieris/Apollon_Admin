import { formatCurrency } from "@/lib/utils";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface ServicesBulkActionsProps {
  selectedIds: Set<string> | "all";
  onBulkAction: (action: string) => void;
  selectedCount: number;
  selectedTotalRemaining: number;
  disableAllActions?: boolean;
}

const ServicesBulkActions: React.FC<ServicesBulkActionsProps> = ({
  selectedIds,
  onBulkAction,
  selectedCount,
  selectedTotalRemaining,
  disableAllActions = false,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-divider bg-dark-100/40 p-2">
      <div className="flex items-center gap-2 pl-2">
        <span className="text-sm font-medium">
          Επιλεγμένες Υπηρεσίες ({selectedCount})
        </span>
        <span className="text-large font-semibold text-warning-500">
          Υπόλοιπο: {formatCurrency(selectedTotalRemaining)}
        </span>
      </div>
      <div className="flex gap-2">
        <Button
          size="md"
          color="success"
          variant="flat"
          startContent={<Icon icon="lucide:credit-card" />}
          onPress={() => onBulkAction("fullPay")}
          isDisabled={selectedCount === 0 || disableAllActions}
        >
          Εξόφληση
        </Button>
        <Button
          size="md"
          color="secondary"
          variant="flat"
          startContent={<Icon icon="lucide:divide" />}
          onPress={() => onBulkAction("partialPay")}
          isDisabled={selectedCount === 0 || disableAllActions}
        >
          Έναντι Πληρωμή
        </Button>
        <Button
          size="md"
          color="warning"
          variant="flat"
          startContent={<Icon icon="lucide:percent" />}
          onPress={() => onBulkAction("tax")}
          isDisabled={selectedCount === 0 || disableAllActions}
        >
          ΦΠΑ
        </Button>
        <Button
          size="md"
          variant="flat"
          startContent={<Icon icon="lucide:tag" />}
          onPress={() => onBulkAction("discount")}
          isDisabled={selectedCount === 0 || disableAllActions}
        >
          Έκπτωση
        </Button>
        <Button
          size="md"
          color="default"
          variant="flat"
          startContent={<Icon icon="lucide:printer" />}
          onPress={() => onBulkAction("print")}
          isDisabled={selectedCount === 0}
        >
          Εκτύπωση
        </Button>
        <Button
          size="md"
          color="danger"
          variant="flat"
          startContent={<Icon icon="lucide:trash-2" />}
          onPress={() => onBulkAction("delete")}
          isDisabled={selectedCount === 0 || disableAllActions}
        >
          Διαγραφή
        </Button>
      </div>
    </div>
  );
};

export default ServicesBulkActions;
