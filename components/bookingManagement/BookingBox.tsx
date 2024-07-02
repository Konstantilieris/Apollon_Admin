import React, { Suspense } from "react";
import DatePushUrl from "../datepicker/DatePushUrl";
import LocalSearch from "../shared/searchBar/LocalSearch";
import AnimatedCounter from "../shared/AnimatedCounter";
import LoadingSkeleton from "../shared/LoadingSkeleton";

const BookingBox = ({ totalSum }: { totalSum: number }) => {
  return (
    <section
      className="total-balance background-light900_dark200 
  "
    >
      <div className="flex w-full flex-row items-center justify-between gap-8">
        <div className="flex gap-6">
          <LocalSearch
            route="/createbooking"
            placeholder="Αναζήτηση Κρατήσεων"
            otherClasses="max-w-[220px]"
          />
          <DatePushUrl nodate={true} />
        </div>
        <Suspense
          fallback={<LoadingSkeleton size={20} animation="animate-spin" />}
        >
          <div className="text-light850_dark500 background-light700_dark400 flex items-center gap-2 rounded-lg border border-slate-400 p-2 dark:border-slate-300">
            Συνολο Κρατήσεων :
            <div className="font-semibold text-sky-600">
              <AnimatedCounter amount={totalSum} />
            </div>
          </div>
        </Suspense>
      </div>
    </section>
  );
};

export default BookingBox;
