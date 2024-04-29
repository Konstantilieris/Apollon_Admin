import Booking from "@/components/booking/Booking";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { getAllClientsByQuery } from "@/lib/actions/client.action";
import { getAllRooms } from "@/lib/actions/room.action";
import { replacePercent20 } from "@/lib/utils";
import { Suspense } from "react";

const Page = async ({ searchParams }: any) => {
  const [clients, rooms] = await Promise.all([
    getAllClientsByQuery(replacePercent20(searchParams.q)),
    getAllRooms(),
  ]);

  return (
    <Suspense
      fallback={<LoadingSkeleton size={30} animation="animate-pulse" />}
    >
      <Booking clients={clients} rooms={rooms} />{" "}
    </Suspense>
  );
};

export default Page;
