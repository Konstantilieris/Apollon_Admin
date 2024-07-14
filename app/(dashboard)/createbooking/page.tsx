import BookingBox from "@/components/bookingManagement/BookingBox";
import BookingTable from "@/components/bookingManagement/BookingTable";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import Pagination from "@/components/shared/Pagination";
import { getAllBookings } from "@/lib/actions/booking.action";
import { intToDate } from "@/lib/utils";

import { Suspense } from "react";

const Page = async ({ searchParams }: any) => {
  const [bookings, isNext, totalSum] = await getAllBookings({
    fromDate: intToDate(+searchParams.fr),
    toDate: intToDate(+searchParams.to),
    page: searchParams.page ? +searchParams.page : 1,
    query: searchParams.q ? searchParams.q : "",
  });

  return (
    <section className=" flex h-screen max-h-[2200px] w-full flex-row  py-2">
      <div className="  custom-scrollbar flex w-full flex-1 flex-col   gap-8  overflow-y-auto scroll-smooth px-5  py-7 max-2xl:gap-2 max-2xl:py-8 sm:px-8">
        <header className=" flex flex-col justify-between gap-8 max-2xl:gap-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-dark100_light900 font-semibold max-lg:text-sm lg:text-lg">
              {" "}
              ΔΙΑΧΕΙΡΙΣΗ
              <span className="text-bankGradient">&nbsp;ΚΡΑΤΗΣΕΩΝ</span>
            </h1>
            <p className="text-dark500_light500 mb-4 font-normal max-md:text-sm lg:text-lg">
              Διαχειριστείτε τις κρατήσεις σας με ευκολία και ακρίβεια.
              Καταγράψτε τις κρατήσεις σας και διαχειριστείτε το χρονοδιάγραμμά
              σας με αξιοπιστία.
            </p>
          </div>
          <BookingBox totalSum={totalSum} />
        </header>

        {bookings.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <LoadingSkeleton size={40} animation="animate-pulse" />
            <h2 className="text-dark100_light900 text-lg font-semibold">
              Δεν υπάρχουν κρατήσεις
            </h2>
            <p className="text-dark500_light500 text-center font-normal">
              Δεν υπάρχουν κρατήσεις για την επιλεγμένη περίοδο. Παρακαλώ
              επιλέξτε μια άλλη περίοδο.
            </p>
          </div>
        ) : (
          <div className="mb-32">
            <Suspense
              fallback={<LoadingSkeleton size={20} animation="animate-spin" />}
            >
              {" "}
              <BookingTable bookings={bookings} />
              <Pagination
                pageNumber={searchParams.page ? +searchParams.page : 1}
                isNext={isNext}
              />
            </Suspense>
          </div>
        )}
      </div>
      <aside className="no-scrollbar  text-dark100_light900 min-h-[120vh] w-[300px] flex-col items-center   border-l border-gray-400 px-2 py-4 dark:border-gray-200 xl:flex xl:overflow-y-scroll">
        Λιστα Αναμονής
      </aside>
    </section>
  );
};

export default Page;
