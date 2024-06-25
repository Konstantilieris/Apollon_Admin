import {
  getAllCategories,
  getFromMainCategorySubCategoriesTotal,
  getMainCategoriesWithExpenses,
} from "@/lib/actions/expenses.action";
import React, { Suspense } from "react";

import ExpenseBox from "@/components/shared/cards/ExpenseBox";
import RecentExpenses from "@/components/shared/expenses/RecentExpenses";
import Pagination from "@/components/shared/Pagination";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import SubCategoryBadge from "@/components/shared/expenses/SubCategoryBadge";

const page = async ({ searchParams: { id, page, sub, q } }: any) => {
  const main = await getAllCategories();
  const mainId = !id ? main[0]?._id : id;
  const [{ results, hasNextPage }, result] = await Promise.all([
    getMainCategoriesWithExpenses({
      id: mainId,
      page: page ? +page : 1,
      sub,
      query: q,
    }),
    getFromMainCategorySubCategoriesTotal({ id: mainId }),
  ]);
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
        <Suspense
          fallback={<LoadingSkeleton size={20} animation="animate-spin" />}
        >
          <RecentExpenses
            data={main}
            collection={results}
            mainId={mainId}
            query={mainId}
          />
        </Suspense>

        <div>
          <Suspense
            fallback={<LoadingSkeleton size={20} animation="animate-spin" />}
          >
            {results.length > 0 ? (
              <div className="mt-10">
                <Pagination
                  pageNumber={page ? +page : 1}
                  isNext={hasNextPage}
                />
              </div>
            ) : (
              <div className="mt-12 flex justify-center">
                <LoadingSkeleton size={140} animation="animate-pulse" />
              </div>
            )}
          </Suspense>
        </div>
      </div>
      <aside className="no-scrollbar  min-h-[120vh] w-[300px] flex-col border-l border-gray-400  px-2 py-4 dark:border-gray-200 xl:flex xl:overflow-y-scroll">
        <h1 className="mb-2 text-center text-dark-400 dark:text-light-700 ">
          {" "}
          Μηνιαία Έξοδα Yποκατηγορίας
        </h1>
        {result.map((item: any) => (
          <SubCategoryBadge key={item.subcategory._id} sub={item} />
        ))}
      </aside>
    </section>
  );
};

export default page;
