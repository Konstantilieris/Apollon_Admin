import React, { useCallback, useRef } from "react";
import { Button, Skeleton } from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatCurrency } from "@/lib/utils";
import { syncFinancialSummary } from "@/lib/actions/payment.action";
import KPIStat7 from "./KpiRevenue";
import { RevenueTrend } from "@/types";
import { TrendCard } from "./TrendCard";
import { SyncFinancialCard } from "./SyncFinancialCard";

interface TableTopContentProps {
  monthlyRevenueTrend: RevenueTrend;
  yearlyRevenueTrend: RevenueTrend;
  selectedIds: any;
  openCreatePaymentModal: any;
  hasSelection: boolean;
  selectedCount: number;
  weeklyRevenue: any;
  totalRevenue?: number; // Optional, if needed for display
}

export const TableTopContent: React.FC<TableTopContentProps> = ({
  monthlyRevenueTrend,
  yearlyRevenueTrend,
  totalRevenue,
  selectedIds,
  openCreatePaymentModal,
  hasSelection,
  selectedCount,
  weeklyRevenue,
}) => {
  const [loading, setLoading] = React.useState(false);
  const isSyncingRef = useRef(false);
  const handleSync = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    setLoading(true);
    try {
      await syncFinancialSummary();
    } catch (err) {
      console.error("Error syncing payments:", err);
    } finally {
      setLoading(false);
      isSyncingRef.current = false;
    }
  }, []); // <-- no deps

  return (
    <div className="flex flex-col gap-2 border-b border-divider p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-row items-center gap-4  ">
        <SyncFinancialCard
          title="Συνολικά Έσοδα"
          amount={totalRevenue || 0}
          loading={loading}
          onSync={handleSync}
        />
        <Skeleton isLoaded={yearlyRevenueTrend.value !== undefined}>
          <TrendCard
            title="Ετήσια Έσοδα"
            value={formatCurrency(yearlyRevenueTrend.value)}
            change={yearlyRevenueTrend.change}
            changeType={yearlyRevenueTrend.changeType}
            trendType={yearlyRevenueTrend.trendType}
            trendChipPosition="top"
            trendChipVariant="flat"
          />
        </Skeleton>

        <Skeleton isLoaded={monthlyRevenueTrend.value !== undefined}>
          <TrendCard
            title="Mηνιαία Έσοδα"
            value={formatCurrency(monthlyRevenueTrend.value)}
            change={monthlyRevenueTrend.change}
            changeType={monthlyRevenueTrend.changeType}
            trendType={monthlyRevenueTrend.trendType}
            trendChipPosition="top"
            trendChipVariant="flat"
          />
        </Skeleton>

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
