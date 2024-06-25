import GlobalSearch from "@/components/shared/searchBar/GlobalSearch";
import WeatherRow from "@/components/shared/weatherApi/WeatherRow";

import React from "react";

const page = async () => {
  return (
    <div className="flex  h-full w-full flex-col gap-12 py-4 pr-16">
      <GlobalSearch />
      <WeatherRow />
      <div className="flex flex-row  flex-wrap  gap-4 max-sm:justify-center "></div>
    </div>
  );
};

export default page;
