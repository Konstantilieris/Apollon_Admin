import AddBudgetForm from "@/components/form/AddBudgetForm";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import SearchBar from "@/components/shared/SearchBar";
import {
  getAllCategories,
  getExpensesByCategories,
  getTotalAmountByCategoryForCurrentMonth,
} from "@/lib/actions/expenses.action";
import React, { Suspense } from "react";
import Image from "next/image";
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
    <section className="relative flex w-full flex-row py-2 ">
      <div className="flex flex-1 flex-col ">
        <Suspense
          fallback={<LoadingSkeleton size={30} animation="animate-pulse" />}
        >
          <AddBudgetForm data={categories} />
        </Suspense>
        <div className="flex flex-row items-center justify-center max-md:flex-col max-md:items-start lg:gap-2">
          <SearchBar
            route="/expenses"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Ψάξε συγκεκριμένη κατηγορία"
            otherClasses="flex-1 mt-4 max-w-[400px] text-dark200_light900 border-white border max-md:hidden "
          />
          <FilterCategories
            filters={categories}
            otherClasses="min-h-[56px] sm:min-w-[170px] max-w-[200px] mt-4"
            containerClasses="max-md:flex font-noto_sans font-bold"
          />
          <Filter
            filters={HomePageFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px] max-w-[200px] mt-4"
            containerClasses="max-md:flex font-noto_sans font-bold"
          />
        </div>
        <div className="flex w-full flex-row max-md:flex-col">
          <div className="mt-10 flex  flex-1 flex-col gap-4">
            {expenses?.expensesByCategories?.map((expense: any) => (
              <div key={expense._id} className="flex flex-col">
                <span className="text-dark200_light900 background-light900_dark300 mb-8  flex flex-row items-center gap-4 self-center rounded-lg border-2 border-orange-700 px-4 py-2  text-center font-noto_sans text-[30px] font-extrabold">
                  {expense._id.toUpperCase()}{" "}
                  <Image
                    src={"/assets/icons/dash.svg"}
                    width={40}
                    alt="dash"
                    height={30}
                  />
                </span>
                <div className="flex w-full flex-row justify-center gap-8">
                  <div className="flex  flex-col gap-2">
                    {expense.expenses.map((item: any) => (
                      <ExpenseCard key={item._id} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-10 ">
              <Pagination
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={expenses.isNext}
              />
            </div>
          </div>

          <div className="flex h-full flex-col items-center justify-start px-8">
            <Suspense
              fallback={<LoadingSkeleton size={30} animation="animate-pulse" />}
            >
              <ExpenseChart categories={monthlyAmount} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
