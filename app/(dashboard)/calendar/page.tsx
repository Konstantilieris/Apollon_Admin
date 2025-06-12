import React from "react";

import Scheduler from "@/components/Scheduler/Calendar";
import { getRevenueData } from "@/lib/actions/service.action";
import CustomModalProvider from "@/components/Scheduler/EditModal/CustomModalProvider";
export const dynamic = "force-dynamic";
const Calendar = async () => {
  const [revenueData] = await Promise.all([getRevenueData()]);

  return (
    <section className=" h-screen w-full   p-2 pb-4">
      <CustomModalProvider />
      <Scheduler revenueData={revenueData} />
    </section>
  );
};

export default Calendar;
