import Scheduler from "@/components/bigCalendar/Calendar";
import { getAllEvents } from "@/lib/actions/event.action";

import React from "react";

const page = async () => {
  const events = await getAllEvents();

  return (
    <section className="flex h-full items-start justify-center py-8">
      <Scheduler appointments={events} />
    </section>
  );
};

export default page;
