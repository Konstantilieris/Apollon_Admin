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
    <header className="relative mx-4  mt-12 flex min-h-[70px] w-full max-w-[94vw] items-center justify-between  rounded-lg bg-neutral-900 p-4">
      <div className="flex   gap-2">
        <SearchBar
          otherClasses=" min-w-[14vw] max-w-[20vw] z-30"
          imgSrc="/assets/icons/search.svg"
          iconPosition="left"
          placeholder="Αναζήτηση..."
          route={"/booking"}
        />
        <Filter
          containerClasses="min-w-[150px] z-30"
          otherClasses="focus:outline-none border-none "
          filters={[
            { name: "Όλα", value: "all" },
            { name: "Κατειλημμένο", value: "full" },
            { name: "Διαθέσιμο", value: "empty" },
          ]}
        />
      </div>

      <ArrowPagination
        pageNumber={pageNumber}
        isNext={isNext}
        className="absolute inset-x-0"
      />

      <div
        className={cn(
          " flex gap-2 rounded-lg bg-neutral-800 px-4 py-4 font-semibold  ",
          capacity && capacity < 20 && "text-red-500",
          capacity && capacity >= 20 && capacity < 50 && "text-yellow-500",
          capacity && capacity >= 50 && "text-green-500",
          !capacity && "text-yellow-500"
        )}
      >
        <span>ΔΙΑΘΕΣΙΜΟΤΗΤΑ: </span>
        {capacity ?? 0}
        <span>%</span>
      </div>
    </header>
  );
};

export default BookingSearchFilter;
