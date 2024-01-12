import DashCards from "@/components/shared/cards/DashCards";
import NewUsersCard from "@/components/shared/cards/NewUsersCard";
import TaskCard from "@/components/shared/cards/TaskCard";
import React from "react";

const page = () => {
  return (
    <div className="flex  h-full w-full flex-col gap-12  px-4 ">
      <h2 className="text-dark300_light700 self-start font-noto_sans text-4xl font-semibold tracking-wide  max-md:hidden  ">
        Καλωσήρθες ADMIN
      </h2>
      <div className="flex flex-row  flex-wrap  gap-4 max-sm:justify-center ">
        <DashCards title="All Earnings" show="$30200" navigation="/dashboard" />
        <DashCards title="All Earnings" show="$30200" navigation="/dashboard" />
        <DashCards title="All Earnings" show="$30200" navigation="/dashboard" />
        <DashCards title="All Earnings" show="$30200" navigation="/dashboard" />
      </div>
      <div className=" mt-8  flex flex-row justify-start gap-10 max-sm:self-center">
        <NewUsersCard />
        <TaskCard />
      </div>
    </div>
  );
};

export default page;
