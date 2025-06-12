"use client";

import React from "react";
import { Button, Card, Skeleton, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatCurrency } from "@/lib/utils";

export interface SyncFinancialCardProps {
  /** Headline, e.g. “Συνολικές Πληρωμές” or “Συνολικά Έξοδα” */
  title: string;
  /** Number you want to display (already fetched) */
  amount: number;
  /** Loading flag while sync is in-flight */
  loading: boolean;
  /** What to call when user hits the refresh button */
  onSync: () => void | Promise<void>;
}

/**
 * Re-usable card that shows a currency amount + a refresh button.
 * Memoised so it only re-renders when props actually change.
 */
export const SyncFinancialCard: React.FC<SyncFinancialCardProps> = React.memo(
  ({ title, amount, loading, onSync }) => {
    const handleClick = React.useCallback(() => {
      if (!loading) onSync();
    }, [loading, onSync]);

    return (
      <Card className="flex min-h-[120px] min-w-[270px] flex-col  justify-center  border border-transparent px-4 dark:border-default-100">
        <div className="flex items-center justify-between">
          <span className="text-base tracking-wide  text-default-500">
            {title}
          </span>
          <Button
            isIconOnly
            size="md"
            className="self-end"
            variant="light"
            aria-label={`Refresh ${title}`}
            onPress={handleClick}
            isDisabled={loading}
          >
            {loading ? (
              <Spinner size="sm" />
            ) : (
              <Icon icon="lucide:refresh-cw" />
            )}
          </Button>
        </div>

        <Skeleton isLoaded={!loading}>
          <span className="text-2xl font-semibold">
            {formatCurrency(amount)}
          </span>
        </Skeleton>
      </Card>
    );
  }
);

SyncFinancialCard.displayName = "SyncFinancialCard";
