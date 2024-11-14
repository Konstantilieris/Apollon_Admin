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
    <header className="mx-1 mt-8 flex min-h-[70px] w-full items-center px-4">
      <div className="ml-4 flex flex-1 items-center gap-4">
        <SearchBar
          otherClasses="max-w-[180px] min-w-[180px] "
          imgSrc="/assets/icons/search.svg"
          iconPosition="left"
          placeholder="Αναζήτηση..."
          route={"/booking"}
        />
        <Filter
          containerClasses="min-w-[145px] "
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
            "mr-12 flex gap-2 rounded-lg bg-neutral-800 px-4 py-2 font-semibold",
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
