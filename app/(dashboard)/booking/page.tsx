import BookingTable from "@/components/bookingManagement/BookingTable";
import ModalBookingProvider from "@/components/bookingManagement/Modal/ModalProvider";

import { getAllBookings } from "@/lib/actions/booking.action";
import { intToDate } from "@/lib/utils";

const Page = async ({ searchParams }: any) => {
  const fromDate = searchParams.fr ? intToDate(+searchParams.fr) : undefined;
  const toDate = searchParams.to ? intToDate(+searchParams.to) : undefined;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const query = searchParams.q || "";
  const flag1 = searchParams.flg1 === "true";
  const flag2 = searchParams.flg2 === "true";

  const { bookings, totalPages } = await getAllBookings({
    fromDate,
    toDate,
    page,
    query,
    flag1,
    flag2,
  });

  return (
    <section className=" flex h-screen max-h-[2200px] w-full flex-row  py-2">
      <div className="  custom-scrollbar flex w-full flex-1 flex-col   gap-8  overflow-y-auto scroll-smooth px-5  py-7 max-2xl:gap-2 max-2xl:py-8 sm:px-8">
        <BookingTable bookings={bookings} totalPages={totalPages} />
        <ModalBookingProvider />
      </div>
      <aside className="no-scrollbar  text-dark100_light900 min-h-[120vh] w-[300px] flex-col items-center   border-l border-gray-400 px-2 py-4 dark:border-gray-200 xl:flex xl:overflow-y-scroll">
        Λιστα Αναμονής
      </aside>
    </section>
  );
};

export default Page;
