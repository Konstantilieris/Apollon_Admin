import BookingBox from "@/components/clientProfile/Book/BookingBox";

import ContainerRooms from "@/components/clientProfile/Book/RoomResults/ContainerRooms";
import LoadingSkeleton from "@/components/shared/skeletons/LoadingSkeleton";

import { getAllRoomsAndBookings } from "@/lib/actions/booking.action";
import { getClientByIdForBooking } from "@/lib/actions/client.action";
import { intToDate } from "@/lib/utils";

import React, { Suspense } from "react";
interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string };
}
const page = async ({ params, searchParams }: PageProps) => {
  const [client, { allRooms: rooms, isNext, freeCapacityPercentage }] =
    await Promise.all([
      getClientByIdForBooking(params.id),
      getAllRoomsAndBookings({
        rangeDate: {
          from: intToDate(+searchParams.fr),
          to: intToDate(+searchParams.to),
        },
        page: searchParams.page ? +searchParams.page : 1,
        filter: searchParams.filter,
        query: searchParams.q ? searchParams.q : "",
      }),
    ]);

  const pageNumber = searchParams.page ? +searchParams.page : 1;

  return (
    <section className="flex h-full w-full flex-col ">
      <BookingBox client={JSON.parse(JSON.stringify(client))} />
      <Suspense
        fallback={<LoadingSkeleton size={100} animation="animate-spin" />}
      >
        <ContainerRooms
          rooms={rooms}
          isNext={isNext}
          pageNumber={pageNumber}
          freeCapacityPercentage={freeCapacityPercentage}
        />
      </Suspense>
    </section>
  );
};

export default page;
