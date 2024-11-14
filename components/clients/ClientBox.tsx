import React, { Suspense } from "react";
import DatePushUrl from "../datepicker/DatePushUrl";
import LocalSearch from "../shared/searchBar/LocalSearch";

import LoadingSkeleton from "../shared/skeletons/LoadingSkeleton";

const ClientBox = ({ total }: { total: number }) => {
  return (
    <section
      className="total-balance background-light900_dark200 
  "
    >
      <div className="flex w-full flex-row items-center justify-between gap-8">
        <div className="flex gap-6">
          <LocalSearch
            route="/clients"
            placeholder="Αναζήτηση Πελατών"
            otherClasses="max-w-[300px] min-w-[300px] "
          />
          <DatePushUrl nodate={true} />
        </div>
        <Suspense
          fallback={<LoadingSkeleton size={20} animation="animate-spin" />}
        >
          <div className="text-light850_dark500 background-light700_dark400 flex items-center gap-2 rounded-lg border border-slate-400 p-2 dark:border-slate-300 max-lg:hidden">
            Συνολο Πελατών :
            <div className="font-semibold text-sky-600">{total ?? 0}</div>
          </div>
        </Suspense>
      </div>
    </section>
  );
};

export default ClientBox;
