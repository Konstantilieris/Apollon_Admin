import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import CategoryTabItem from "./CategoryTabItem";

import ExpenseInfo from "./ExpenseInfo";
import {
  getTopSubCategory,
  getTotalFromCategoryWithId,
} from "@/lib/actions/expenses.action";
import ExpensesTable from "./ExpensesTable";

const RecentExpenses = async ({ data, mainId, collection, query }: any) => {
  const [total, topSubCategory] = await Promise.all([
    getTotalFromCategoryWithId({ id: query }),
    getTopSubCategory({ id: query }),
  ]);

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
        {data
          ?.filter((item: any) => item._id === mainId)
          .map((main: any) => (
            <ExpenseInfo
              data={main}
              totalSum={total[0]?.totalAmount}
              key={main._id}
              topSubCategory={topSubCategory}
            />
          ))}

        <TabsContent
          key={collection[0]?.mainCategory._id}
          value={collection[0]?.mainCategory._id}
          className="space-y-4"
        >
          <ExpensesTable expenses={collection[0]?.expenses} />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default RecentExpenses;
