import { getAllEvents } from "@/lib/actions/event.action";

import React from "react";

import Scheduler from "@/components/Scheduler/Calendar";
import { getRevenueData } from "@/lib/actions/service.action";
import CustomModalProvider from "@/components/Scheduler/EditModal/CustomModalProvider";

const Calendar = async () => {
  const [events, revenueData] = await Promise.all([
    getAllEvents(),
    getRevenueData(),
  ]);

  return (
    <section className=" h-full w-full p-1 pb-4">
      <CustomModalProvider />
      <Scheduler
        appointments={JSON.parse(JSON.stringify(events))}
        revenueData={revenueData}
      />
    </section>
  );
};

export default Calendar;
