import AddBudgetForm from "@/components/form/AddBudgetForm";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import SearchBar from "@/components/shared/SearchBar";
import {
  getAllCategories,
  getExpensesByCategories,
  getTotalAmountByCategoryForCurrentMonth,
} from "@/lib/actions/expenses.action";
import React, { Suspense } from "react";

import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants";
import ExpenseCard from "@/components/shared/cards/ExpenseCard";
import ExpenseChart from "@/components/shared/cards/ExpenseChart";
import Pagination from "@/components/shared/Pagination";
import FilterCategories from "@/components/shared/FilterCategories";
const page = async ({ searchParams }: any) => {
  const [expenses, categories, monthlyAmount] = await Promise.all([
    getExpensesByCategories({
      categoryName: searchParams.categ ? searchParams.categ : "",
      filter: searchParams.filter,
      description: searchParams.q,
      page: searchParams.page ? +searchParams.page : 1,
    }),
    getAllCategories(),
    getTotalAmountByCategoryForCurrentMonth({
      categoryName: searchParams.categ,
    }),
  ]);

  return (
    <section className="flex flex-col lg:min-h-[1150px]">
      <Suspense
        fallback={<LoadingSkeleton size={30} animation="animate-pulse" />}
      >
        <AddBudgetForm data={categories} />
      </Suspense>
      <div className="flex flex-row items-center justify-center gap-2">
        <SearchBar
          route="/expenses"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Ψάξε συγκεκριμένη κατηγορία"
          otherClasses="flex-1 mt-4 max-w-[400px]"
        />
        <FilterCategories
          filters={categories}
          otherClasses="min-h-[56px] sm:min-w-[170px] max-w-[200px] mt-4"
          containerClasses="max-md:flex"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px] max-w-[200px] mt-4"
          containerClasses="max-md:flex"
        />
      </div>

      <div className="mt-10 flex flex-1 flex-col gap-2">
        {expenses?.expensesByCategories?.map((expense: any) => (
          <div key={expense._id} className="flex flex-col">
            <span className="text-dark200_light900 mr-28 text-center font-noto_sans text-[30px] font-extrabold">
              {expense._id.toUpperCase()}{" "}
            </span>
            <div className="flex w-full flex-row justify-center gap-8">
              <div className="flex flex-1 flex-col">
                {expense.expenses.map((item: any) => (
                  <ExpenseCard key={item._id} item={item} />
                ))}
              </div>
              <div className="flex  min-w-[400px]">
                <ExpenseChart
                  expense={monthlyAmount.totalAmountByCategory.find(
                    (element) => element._id === expense._id
                  )}
                  totalSum={monthlyAmount.totalSumFromAllCategories}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 ">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={expenses.isNext}
        />
      </div>
    </section>
  );
};

export default page;
