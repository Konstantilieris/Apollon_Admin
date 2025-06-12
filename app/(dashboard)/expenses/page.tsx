import { ExpensesTrendCard } from "@/components/expenses/AllPaidExpenses";
import ExpenseModal from "@/components/expenses/ExpenseModal";
import ExpensesTable from "@/components/expenses/ExpensesTable";
import { getExpenses, getExpensesTrendSummary } from "@/lib/Query/expenses";

import React from "react";
export const dynamic = "force-dynamic";
const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] };
}) => {
  const q = Object.fromEntries(
    Object.entries(searchParams).map(([k, v]) => [
      k,
      Array.isArray(v) ? v[0] : v,
    ])
  );

  const [{ data, totalPages, totalAmount }, trendData] = await Promise.all([
    getExpenses(q as any),
    getExpensesTrendSummary(),
  ]);
  return (
    <div className="flex h-full  flex-col overflow-y-auto p-3 font-sans">
      <ExpensesTrendCard trendData={trendData} days={30} /> {/* ⬅︎ NEW */}
      <ExpensesTable
        initialData={data}
        totalPages={totalPages}
        totalAmount={totalAmount}
      />
      <ExpenseModal />
    </div>
  );
};

export default page;
