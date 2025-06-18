import React from "react";

import Scheduler from "@/components/Scheduler/Calendar";

import CustomModalProvider from "@/components/Scheduler/EditModal/CustomModalProvider";

const Calendar = async () => {
  return (
    <section className=" h-screen w-full   p-2 pb-4">
      <CustomModalProvider />
      <Scheduler />
    </section>
  );
};

export default Calendar;
