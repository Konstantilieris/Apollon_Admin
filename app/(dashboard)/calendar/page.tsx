import { getAllEvents } from "@/lib/actions/event.action";

import React, { Suspense } from "react";
import LoadingSkeleton from "@/components/shared/skeletons/LoadingSkeleton";

import dynamic from "next/dynamic";

const NoSSR = dynamic(() => import("@/components/Scheduler/Calendar"), {
  ssr: false,
});
const Page = async () => {
  const events = await getAllEvents();

  return (
    <section className="  h-full  w-full p-1">
      <Suspense
        fallback={<LoadingSkeleton size={24} animation="animate-pulse" />}
      >
        <NoSSR appointments={events} />
      </Suspense>
    </section>
  );
};

export default Page;
