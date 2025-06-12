"use client";

import { TrendCard } from "../clientProfile2/Financial/Payment/TrendCard";
import { getExpensesTrendSummary } from "@/lib/Query/expenses";

/* The shape returned by getExpensesTrendSummary */
type TrendSummary = Awaited<ReturnType<typeof getExpensesTrendSummary>>;

export function ExpensesTrendCard({
  trendData, // ← injected by the server component
  days,
}: {
  trendData?: TrendSummary;
  days: number;
}) {
  /* ------------------------------------------------------------------
     Option A – server already sent the data (normal path)
  ------------------------------------------------------------------ */
  if (trendData) {
    return <InnerCard data={trendData} />;
  }
}

/* ------------- tiny helper so we don’t repeat thlocae render logic ------------- */
function InnerCard({ data }: { data: TrendSummary }) {
  const { total, deltaPct } = data; // total == all-time paid expenses

  const changeType =
    deltaPct === 0 ? "neutral" : deltaPct < 0 ? "positive" : "negative";

  const trendType = deltaPct === 0 ? "neutral" : deltaPct < 0 ? "down" : "up";

  return (
    <div className="flex px-8">
      <TrendCard
        title="Συνολικά Έξοδα"
        value={`${total.toFixed(2)} €`}
        change={`${Math.abs(deltaPct).toFixed(1)} %`} /* period Δ%   */
        changeType={changeType}
        trendType={trendType}
        trendChipPosition="top"
        trendChipVariant="flat"
      />
    </div>
  );
}
