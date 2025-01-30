import ClientBox from "@/components/clients/ClientBox";
import ClientTable from "@/components/clients/ClientTable";
import Pagination from "@/components/shared/Pagination";
import LoadingSkeleton from "@/components/shared/skeletons/LoadingSkeleton";
import { getAllClients } from "@/lib/actions/client.action";
import { intToDate, sanitizeQuery } from "@/lib/utils";
import React, { Suspense } from "react";

const Clients = async ({ searchParams }: any) => {
  const { clients, isNext, totalClients } = await getAllClients({
    page: searchParams.page ? +searchParams.page : 1,
    query: sanitizeQuery(searchParams.q),
    fromDate: intToDate(+searchParams.fr),
    toDate: intToDate(+searchParams.to),
  });
  return (
    <section className=" flex h-screen max-h-[2200px] w-full flex-row  py-2">
      <div className="  custom-scrollbar flex w-full flex-1 flex-col   gap-8  overflow-y-auto scroll-smooth px-5  py-7 max-2xl:gap-2 max-2xl:py-8 sm:px-8">
        <header className=" flex flex-col justify-between gap-8 max-2xl:gap-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-dark100_light900 font-semibold max-lg:text-sm lg:text-lg">
              {" "}
              ΔΙΑΧΕΙΡΙΣΗ
              <span className="text-yellow-500">&nbsp;ΠΕΛΑΤΩΝ</span>
            </h1>
            <p className="text-dark500_light500 mb-4 font-normal max-md:text-sm lg:text-lg">
              Διαχειριστείτε τους πελάτες σας με ευκολία και ακρίβεια.
              Καταγράψτε τους πελάτες σας και διαχειριστείτε το πελατολόγιό σας
              με αξιοπιστία.
            </p>
          </div>
          <ClientBox total={totalClients} />
          {clients.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <LoadingSkeleton size={40} animation="animate-pulse" />
              <h2 className="text-dark100_light900 text-lg font-semibold">
                Δεν υπάρχουν πελάτες
              </h2>
              <p className="text-dark500_light500 text-center font-normal">
                Δεν είχαν δημιουργηθεί πελάτες τις συγκεκριμένες ημερομηνίες .
                Παρακαλώ επιλέξτε μια άλλη περίοδο.
              </p>
            </div>
          ) : (
            <div className="mb-32">
              <Suspense
                fallback={
                  <LoadingSkeleton size={20} animation="animate-spin" />
                }
              >
                {" "}
                <ClientTable clients={clients} />
                <Pagination
                  pageNumber={searchParams.page ? +searchParams.page : 1}
                  isNext={isNext}
                />
              </Suspense>
            </div>
          )}
        </header>
      </div>
    </section>
  );
};

export default Clients;
