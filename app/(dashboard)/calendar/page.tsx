import Scheduler from "@/components/bigCalendar/Calendar";
import { getAllEvents } from "@/lib/actions/event.action";

import React from "react";

const page = async () => {
  const events = await getAllEvents();

  return (
    <section className="  h-screen min-h-screen  w-full px-2 py-8 ">
      <Scheduler appointments={events} />
    </section>
  );
};

export default page;
