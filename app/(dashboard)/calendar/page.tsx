import Scheduler from "@/components/bigCalendar/Calendar";
import { getAllEvents } from "@/lib/actions/event.action";

import React from "react";

const page = async () => {
  const events = await getAllEvents();

  return (
    <section className="flex justify-center  lg:max-h-[1vh] lg:p-4 2xl:p-8">
      <Scheduler appointments={events} />
    </section>
  );
};

export default page;
