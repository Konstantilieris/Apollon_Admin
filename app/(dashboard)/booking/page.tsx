import BookingTable from "@/components/bookingManagement/BookingTable";
import ModalBookingProvider from "@/components/bookingManagement/Modal/ModalProvider";

import { getAllBookings } from "@/lib/actions/booking.action";
import { intToDate } from "@/lib/utils";

const Page = async ({ searchParams }: any) => {
  const fromDate = searchParams.fr ? intToDate(+searchParams.fr) : undefined;
  const toDate = searchParams.to ? intToDate(+searchParams.to) : undefined;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const query = searchParams.q || "";
  const flag1 = searchParams.flag1 === "true";
  const flag2 = searchParams.flag2 === "true";

  const { bookings, totalPages } = await getAllBookings({
    fromDate,
    toDate,
    page,
    query,
    flag1,
    flag2,
  });

  return (
    <section className=" flex h-screen max-h-[2200px] w-full flex-row  px-6 py-4">
      <BookingTable bookings={bookings} totalPages={totalPages} />
      <ModalBookingProvider />
    </section>
  );
};

export default Page;
