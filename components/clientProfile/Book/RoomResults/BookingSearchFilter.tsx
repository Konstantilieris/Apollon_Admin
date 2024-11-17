import React from "react";
import Filter from "../../../shared/Filter";
import SearchBar from "../../../shared/searchBar/SearchBar";

import { cn } from "@/lib/utils";

import ArrowPagination from "@/components/shared/ArrowPagination";

const BookingSearchFilter = ({
  freeCapacityPercentage,
  pageNumber,
  isNext,
}: {
  freeCapacityPercentage: string | undefined;
  pageNumber: number;
  isNext: boolean;
}) => {
  const capacity = freeCapacityPercentage
    ? parseInt(freeCapacityPercentage)
    : null;
  return (
    <header className="relative mx-1 mt-8 flex min-h-[70px] w-full items-center justify-between overflow-x-hidden rounded-lg bg-neutral-700 px-4">
      <div className="flex   gap-4">
        <SearchBar
          otherClasses=" min-w-[14vw] max-w-[20vw] "
          imgSrc="/assets/icons/search.svg"
          iconPosition="left"
          placeholder="Αναζήτηση..."
          route={"/booking"}
        />
        <Filter
          containerClasses="min-w-[150px]"
          otherClasses="focus:outline-none border-none "
          filters={[
            { name: "Όλα", value: "all" },
            { name: "Κατειλημμένο", value: "full" },
            { name: "Διαθέσιμο", value: "empty" },
          ]}
        />
      </div>
      <ArrowPagination pageNumber={pageNumber} isNext={isNext} />
      {capacity && (
        <div
          className={cn(
            "mr-12 flex gap-2 rounded-lg bg-neutral-800 px-4 py-2 font-semibold  justify-end",
            capacity < 50
              ? "text-red-500"
              : capacity < 75
                ? "text-yellow-500"
                : "text-green-500"
          )}
        >
          <span>ΔΙΑΘΕΣΙΜΟΤΗΤΑ: </span>
          {capacity ?? 0}
          <span>%</span>
        </div>
      )}
    </header>
  );
};

export default BookingSearchFilter;
