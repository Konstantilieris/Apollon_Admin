import { getAllEvents } from "@/lib/actions/event.action";

import React, { Suspense } from "react";
import LoadingSkeleton from "@/components/shared/skeletons/LoadingSkeleton";

import Scheduler from "@/components/Scheduler/Calendar";

const Page = async () => {
  const events = await getAllEvents();

  return (
    <section className="  h-full  w-full p-1">
      <Suspense
        fallback={<LoadingSkeleton size={24} animation="animate-pulse" />}
      >
        <Scheduler appointments={events} />
      </Suspense>
    </section>
  );
};

export default Page;
