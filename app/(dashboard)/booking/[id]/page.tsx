import AppointmentDailyPlan from "@/components/booking/AppointmentDailyPlan";
import BookingBox from "@/components/booking/BookingBox";

import Room from "@/components/shared/cards/Room";
import Pagination from "@/components/shared/Pagination";

import { getAllRoomsAndBookings } from "@/lib/actions/booking.action";
import { getClientByIdForBooking } from "@/lib/actions/client.action";

import { intToDate2 } from "@/lib/utils";

type SearchParamsProps = {
  params: { id: string };
  searchParams: { [key: string]: string };
};
const EditChange = async ({ searchParams, params }: SearchParamsProps) => {
  const [client, { allRooms: rooms, isNext }] = await Promise.all([
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
    <section className=" flex h-screen max-h-[2200px]   flex-row   font-sans  ">
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
        <section className="recent-expenses text-dark400_light500 bg-light-700 font-sans dark:bg-dark-200">
          <div className="mb-20 flex w-full flex-col items-center justify-center gap-2 px-8 py-4">
            {rooms.map((room: any) => (
              <Room
                room={JSON.parse(JSON.stringify(room))}
                client={JSON.parse(JSON.stringify(client))}
                key={room.name}
              />
            ))}

            <Pagination pageNumber={pageNumber} isNext={isNext} />
          </div>
        </section>
      </div>
      <aside className="  custom-scrollbar   flex h-screen max-h-[2200px] flex-col overflow-y-auto border-l border-gray-200 py-2 max-xl:hidden">
        <h1 className="text-light850_dark500 mt-2 p-2 text-lg font-semibold ">
          Πρόγραμμα Χρονικής Περιόδου
        </h1>
        <div className=" mb-40 flex max-h-[2200px] min-h-screen flex-col items-center justify-between gap-2  ">
          <AppointmentDailyPlan date={intToDate2(+searchParams.fr)} />
          <AppointmentDailyPlan date={intToDate2(+searchParams.to)} />
        </div>
      </aside>
    </section>
  );
};

export default EditChange;
