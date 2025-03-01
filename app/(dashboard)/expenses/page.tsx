import ExpenseModal from "@/components/expenses/ExpenseModal";
import ExpensesTable from "@/components/expenses/ExpensesTable";
import { getAllExpenses } from "@/lib/actions/expenses.action";

import React from "react";
export const dynamic = "force-dynamic";
const page = async () => {
  const expenses = await getAllExpenses();

  return (
    <div className="flex flex-col gap-4 p-4 font-sans">
      <ExpensesTable expenses={expenses} />
      <ExpenseModal />
    </div>
  );
};

export default page;
