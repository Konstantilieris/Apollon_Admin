import {
  getAllCategories,
  getMainCategoriesWithExpenses,
} from "@/lib/actions/expenses.action";
import React from "react";

import ExpenseBox from "@/components/shared/cards/ExpenseBox";
import RecentExpenses from "@/components/shared/expenses/RecentExpenses";
import Pagination from "@/components/shared/Pagination";

const page = async ({ searchParams: { id, page, sub } }: any) => {
  const main = await getAllCategories();
  const mainId = !id ? main[0]?._id : id;
  const { results, hasNextPage } = await getMainCategoriesWithExpenses({
    id: mainId,
    page: page ? +page : 1,
    sub,
  });

  return (
    <section className="  no-scrollbar flex h-full  w-full flex-row  scroll-smooth max-2xl:max-h-screen max-xl:overflow-y-scroll ">
      <div className="flex w-full flex-1 flex-col gap-8   scroll-smooth px-5 py-7 max-2xl:min-h-screen max-2xl:gap-2 max-2xl:py-8 sm:px-8 2xl:max-h-screen">
        <header className=" flex flex-col justify-between gap-8 max-2xl:gap-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-dark100_light900 font-semibold max-lg:text-sm lg:text-lg">
              {" "}
              ΔΙΑΧΕΙΡΙΣΗ<span className="text-bankGradient">&nbsp;ΕΞΟΔΩΝ</span>
            </h1>
            <p className="text-dark500_light500 font-normal max-md:text-sm lg:text-lg ">
              Καταγράφετε τις δαπάνες σας με ευκολία και ακρίβεια. Κατανοήστε
              πώς δαπανάτε τα χρήματά σας και διαχειριστείτε τον προϋπολογισμό
              σας με αξιοπιστία.
            </p>
          </div>
          <ExpenseBox />
        </header>
        <RecentExpenses
          data={main}
          collection={results}
          mainId={main[0]?._id}
          query={mainId}
        />
        <div className="mt-10">
          <Pagination pageNumber={page ? +page : 1} isNext={hasNextPage} />
        </div>
      </div>
      <aside className="no-scrollbar  h-full w-[300px] flex-col border-l border-gray-200 xl:flex xl:overflow-y-scroll"></aside>
    </section>
  );
};

export default page;
