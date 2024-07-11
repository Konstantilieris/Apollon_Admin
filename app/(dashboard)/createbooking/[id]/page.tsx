import AppointmentDailyPlan from "@/components/booking/AppointmentDailyPlan";
import BookingBox from "@/components/booking/BookingBox";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { getClientByIdForBooking } from "@/lib/actions/client.action";
import { getAllRoomsAndBookings } from "@/lib/actions/room.action";
import { intToDate2 } from "@/lib/utils";
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
        from: intToDate2(+searchParams.fr),
        to: intToDate2(+searchParams.to),
      },
      page: searchParams.page ? +searchParams.page : 1,
      filter: searchParams.filter,
      query: searchParams.q ? searchParams.q : "",
    }),
  ]);

  const pageNumber = searchParams.page ? +searchParams.page : 1;
  return (
    <section className=" flex h-screen max-h-[2200px]   flex-row   font-noto_sans  ">
      <div className="  custom-scrollbar flex max-h-[2000px] min-h-screen w-full flex-1   flex-col  gap-8 overflow-y-auto scroll-smooth  px-5 py-7 max-2xl:gap-2 max-2xl:py-8 sm:px-8">
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
      <aside className="no-scrollbar  h-full w-[300px] flex-col border-l border-gray-200 py-2 max-xl:hidden xl:flex xl:overflow-y-scroll">
        <h1 className="text-light850_dark500 mt-2 p-2 text-lg font-semibold ">
          Πρόγραμμα Χρονικής Περιόδου
        </h1>
        <AppointmentDailyPlan date={intToDate2(+searchParams.fr)} />
      </aside>
    </section>
  );
};

export default EditChange;
