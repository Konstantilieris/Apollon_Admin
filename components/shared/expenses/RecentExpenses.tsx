import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import CategoryTabItem from "./CategoryTabItem";

import ExpenseInfo from "./ExpenseInfo";
import { totalFromMainCategoryWithId } from "@/lib/actions/expenses.action";
import ExpensesTable from "./ExpensesTable";

const RecentExpenses = async ({ data, mainId, collection, query }: any) => {
  const total = await totalFromMainCategoryWithId({ id: query });

  return (
    <section className="recent-expenses text-dark400_light500 bg-light-700 dark:bg-dark-200 ">
      <header className="flex items-center justify-between">
        <h2 className="text-light850_dark500 ml-2 font-semibold ">
          Πρόσφατες Δαπάνες
        </h2>
      </header>
      <Tabs className="w-full" defaultValue={mainId}>
        <TabsList className="recent-expenses-tablist">
          {data?.map((main: any) => (
            <TabsTrigger key={main._id} value={main._id}>
              <CategoryTabItem main={main} key={main._id} mainId={mainId} />
            </TabsTrigger>
          ))}
        </TabsList>
        {collection.map((main: any) => (
          <TabsContent
            key={main.mainCategory._id}
            value={main.mainCategory._id}
            className="space-y-4"
          >
            <ExpenseInfo data={main} totalSum={total[0].totalAmount} />
            <ExpensesTable expenses={main.expenses} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RecentExpenses;
