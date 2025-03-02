import { ExpensesCard } from "@/components/expenses/AllPaidExpenses";
import ExpenseModal from "@/components/expenses/ExpenseModal";
import ExpensesTable from "@/components/expenses/ExpensesTable";
import {
  getAllExpenses,
  getFinancialSummary,
} from "@/lib/actions/expenses.action";

import React from "react";
export const dynamic = "force-dynamic";
const page = async () => {
  const total = await getFinancialSummary();
  const expenses = await getAllExpenses();

  return (
    <div className="flex flex-col  p-3 font-sans">
      <ExpensesCard expenses={total} />
      <ExpensesTable expenses={expenses} />
      <ExpenseModal />
    </div>
  );
};

export default page;
