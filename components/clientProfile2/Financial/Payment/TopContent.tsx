import React from "react";
import { Button, Skeleton, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatCurrency } from "@/lib/utils";
import { syncFinancialSummary } from "@/lib/actions/payment.action";
import KPIStat7 from "./KpiRevenue";

interface TableTopContentProps {
  totalAmount: number;
  selectedIds: any;
  openCreatePaymentModal: any;
  hasSelection: boolean;
  selectedCount: number;
  weeklyRevenue: any;
}

export const TableTopContent: React.FC<TableTopContentProps> = ({
  totalAmount,
  selectedIds,
  openCreatePaymentModal,
  hasSelection,
  selectedCount,
  weeklyRevenue,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleSync = async () => {
    if (loading) return; // Guard: no double syncs
    setLoading(true);
    try {
      await syncFinancialSummary();
    } catch (error) {
      console.error("Error syncing payments:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 border-b border-divider p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-row items-center gap-16   ">
        <div className="flex flex-col gap-1">
          <span className="text-base tracking-widest text-default-500">
            Συνολικές Πληρωμές
          </span>
          <div className="flex items-center gap-2">
            <Skeleton isLoaded={!loading}>
              <span className="text-large font-semibold">
                {formatCurrency(totalAmount)}
              </span>
            </Skeleton>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              aria-label="Refresh payments"
              onPress={handleSync}
              isDisabled={loading}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <Icon icon="lucide:refresh-cw" />
              )}
            </Button>
          </div>
        </div>
        <KPIStat7 data={weeklyRevenue} />
      </div>
      <div className="flex items-center gap-2">
        <Button
          color="success"
          variant="bordered"
          startContent={<Icon icon="lucide:plus" />}
          onPress={() => openCreatePaymentModal(true)}
          className="text-base tracking-widest"
        >
          Νέα Πληρωμή
        </Button>
      </div>
    </div>
  );
};
