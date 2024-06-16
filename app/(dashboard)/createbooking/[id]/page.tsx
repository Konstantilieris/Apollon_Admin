import BookingBox from "@/components/booking/BookingBox";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { getClientByIdForBooking } from "@/lib/actions/client.action";
import { getAllRoomsAndBookings } from "@/lib/actions/room.action";
import { intToDate } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const RoomBox = dynamic(() => import("@/components/booking/AvailableRooms"), {
  ssr: false,
});

const EditChange = async ({ searchParams, params }: any) => {
  const [client, { allRooms, isNext }] = await Promise.all([
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
    <section className=" no-scrollbar flex h-full  w-full flex-row  scroll-smooth font-noto_sans max-2xl:max-h-screen max-xl:overflow-y-scroll">
      <div className="flex w-full flex-1 flex-col gap-8   scroll-smooth px-5 py-7 max-2xl:min-h-screen max-2xl:gap-2 max-2xl:py-8 sm:px-8 2xl:max-h-screen">
        <header className=" flex flex-col justify-between gap-8 max-2xl:gap-2">
          <div className="flex flex-col gap-2">
            <h1 className="text-dark100_light900 font-semibold max-lg:text-sm lg:text-lg">
              {" "}
              ΔΗΜΙΟΥΡΓΙΑ
              <span className="text-bankGradient">&nbsp;ΚΡΑΤΗΣΗΣ</span>
            </h1>
            <p className="text-dark500_light500 font-normal max-md:text-sm lg:text-lg ">
              Κάντε την κράτησή σας με ευκολία και ακρίβεια. Οργανώστε τις
              δραστηριότητές σας χωρίς κόπο και διαχειριστείτε το χρόνο σας με
              αξιοπιστία.
            </p>
          </div>

          <BookingBox client={client} searchParams={searchParams} />
        </header>
        <Suspense
          fallback={<LoadingSkeleton size={20} animation="animate-spin" />}
        >
          <RoomBox
            rooms={JSON.parse(JSON.stringify(allRooms))}
            client={JSON.parse(JSON.stringify(client))}
            isNext={isNext}
            pageNumber={pageNumber}
          />
        </Suspense>
      </div>
      <aside className="no-scrollbar  h-full w-[300px] flex-col border-l border-gray-200 max-xl:hidden xl:flex xl:overflow-y-scroll"></aside>
    </section>
  );
};

export default EditChange;
