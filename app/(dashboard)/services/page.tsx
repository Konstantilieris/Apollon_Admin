import ModalClientProvider from "@/components/clientProfile2/ModalContent/ModalClientProvider";
import { ServicesTable } from "@/components/ServiceTable/ServiceTable";
import { GetServicesFilters } from "@/lib/actions/service.action";
import {
  getAllServices,
  getOverdueServicesFromLastMonth,
  getRemainingAmountForCurrentMonth,
  getTopServiceThisWeek,
} from "@/lib/Query/service";
import { intToDate, sanitizeQuery } from "@/lib/utils";
import { Skeleton } from "@heroui/react";
import React from "react";

export const dynamic = "force-dynamic";

const Page = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const { paid, fr, to, sortDir, page, limit, query } = searchParams;

  // parse paid: "paid"|"unpaid" or omit => all
  const paidParam =
    paid === "paid" ? true : paid === "unpaid" ? false : undefined;
  const sanitizedQuery = sanitizeQuery(query);
  // parse page fallback to 1
  const pageNum = page ? Math.max(1, parseInt(page, 10)) : 1;

  const filters: GetServicesFilters = {
    paid: paidParam,
    query: sanitizedQuery,
    from: fr ? intToDate(+fr) : undefined,
    to: to ? intToDate(+to) : undefined,
    sortDir: sortDir === "asc" ? "asc" : "desc",
    page: pageNum,
    limit: limit ? Math.max(1, parseInt(limit, 10)) : 10,
  };

  // fetch rows + count
  const [
    { rows: services, totalCount },
    redOwedServices,
    totalRemainingThisMonth,
    topServiceOfWeek,
  ] = await Promise.all([
    getAllServices(filters),
    getOverdueServicesFromLastMonth(),

    getRemainingAmountForCurrentMonth(),
    getTopServiceThisWeek(),
    // or 14, 30 based on default
  ]);

  const totalPages = Math.ceil(totalCount / filters.limit!);

  return (
    <div className="h-full px-2 py-1">
      <ModalClientProvider />
      <Skeleton isLoaded={!!services}>
        <ServicesTable
          redOwedServices={redOwedServices}
          totalRemainingThisMonth={totalRemainingThisMonth}
          topServiceOfWeek={topServiceOfWeek}
          initialData={services}
          totalPages={totalPages}
          isPaidView={paidParam}
        />
      </Skeleton>
    </div>
  );
};

export default Page;
