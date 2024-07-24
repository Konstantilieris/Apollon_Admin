import React from "react";
import Filter from "../shared/Filter";
import SearchBar from "../shared/searchBar/SearchBar";

const BookingSearchFilter = () => {
  return (
    <header className="mx-1 mt-4 flex min-h-[70px] items-center justify-between rounded-lg border border-indigo-300  bg-light-900 p-2 dark:bg-dark-400">
      <div className="ml-4 flex flex-row items-center gap-4 ">
        <SearchBar
          otherClasses="max-w-[180px] focus-within:border-2 dark:border-light-500 border-slate-300 dark:text-light-900"
          imgSrc="/assets/icons/search.svg"
          iconPosition="left"
          placeholder="Αναζήτηση..."
          route={"/booking"}
        />
        <Filter
          containerClasses="min-w-[145px] "
          filters={[
            { name: "Όλα", value: "all" },
            { name: "Κατειλημμένο", value: "full" },
            { name: "Διαθέσιμο", value: "empty" },
          ]}
        />
      </div>
      <div className=" flex flex-row  items-center gap-2 p-1 ">
        {/* <CreateBook client={client} /> */}
      </div>
    </header>
  );
};

export default BookingSearchFilter;
