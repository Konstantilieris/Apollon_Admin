import WeatherRow from "@/components/shared/weatherApi/WeatherRow";

import React from "react";

const page = async () => {
  return (
    <div className="flex  h-full w-full flex-col gap-12  p-4 ">
      <h2 className="text-dark300_light700 self-start font-noto_sans text-4xl font-semibold tracking-wide  max-md:hidden  ">
        Καλωσήρθες ADMIN
      </h2>
      <WeatherRow />
      <div className="flex flex-row  flex-wrap  gap-4 max-sm:justify-center "></div>
    </div>
  );
};

export default page;
