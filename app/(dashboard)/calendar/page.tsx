import Scheduler from "@/components/bigCalendar/Calendar";
import { getAllEvents } from "@/lib/actions/event.action";

import React from "react";

const page = async () => {
  const events = await getAllEvents();

  return (
    <section className="flex w-full py-4 pr-2">
      <Scheduler appointments={events} />
    </section>
  );
};

export default page;
