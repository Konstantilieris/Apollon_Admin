import { ExpensesCard } from "@/components/expenses/AllPaidExpenses";
import ExpenseModal from "@/components/expenses/ExpenseModal";
import ExpensesTable from "@/components/expenses/ExpensesTable";
import {
  getExpenses,
  getFinancialSummary,
} from "@/lib/actions/expenses.action";

import React from "react";
export const dynamic = "force-dynamic";
const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] };
}) => {
  const total = await getFinancialSummary();

  const q = Object.fromEntries(
    Object.entries(searchParams).map(([k, v]) => [
      k,
      Array.isArray(v) ? v[0] : v,
    ])
  );
  const { data, totalPages, totalAmount } = await getExpenses(q as any);

  return (
    <div className="flex flex-col  p-3 font-sans">
      <ExpensesCard expenses={total} />
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
