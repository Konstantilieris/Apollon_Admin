import { getAllEvents } from "@/lib/actions/event.action";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import LoadingSkeleton from "@/components/shared/skeletons/LoadingSkeleton";
const DynamicCalendar = dynamic(
  () => import("@/components/bigCalendar/Calendar"),
  {
    ssr: false,
  }
);

const page = async () => {
  const events = await getAllEvents();

  return (
    <section className="  h-full  w-full ">
      <Suspense
        fallback={<LoadingSkeleton size={24} animation="animate-pulse" />}
      >
        {events && <DynamicCalendar events={events} />}
      </Suspense>
    </section>
  );
};

export default page;
