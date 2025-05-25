// app/payments/page.tsx
import React from "react";
import { PaymentsTable } from "@/components/clientProfile2/Financial/Payment/Payments-Table";
import { GetPaymentsFilters } from "@/lib/actions/payment.action";

import { intToDate } from "@/lib/utils";
import { Skeleton } from "@heroui/react";

import {
  getMonthlyRevenueTrend,
  getWeeklyRevenue,
  getAllPayments,
  getYearlyRevenueTrend,
  getTotalRevenue,
} from "@/lib/Query/payment";

const Page = async ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const { query, fr, to, reversed, sortDir, page } = searchParams;
  const reversedParam = reversed === "true";
  // parse page fallback to 1
  const pageNum = page ? Math.max(1, parseInt(page, 10)) : 1;

  const filters: GetPaymentsFilters = {
    clientName: query || undefined,
    from: fr ? intToDate(+fr) : undefined,
    to: to ? intToDate(+searchParams.to) : undefined,
    reversed: reversedParam,
    sortDir: sortDir === "asc" ? "asc" : "desc",
    page: pageNum,
    limit: 10,
  };

  const [
    { rows: payments, totalCount },
    weeklyRevenue,
    monthlyRevenueTrend,
    yearlyRevenueTrend,
    totalRevenue, // ➟ new
  ] = await Promise.all([
    getAllPayments(filters),
    getWeeklyRevenue(),
    getMonthlyRevenueTrend(),
    getYearlyRevenueTrend(),
    getTotalRevenue(), // ➟ new
  ]);

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="h-full px-2 py-1">
      <Skeleton isLoaded={payments !== undefined}>
        <PaymentsTable
          totalRevenue={totalRevenue} // ➟ new
          monthlyRevenueTrend={monthlyRevenueTrend}
          yearlyRevenueTrend={yearlyRevenueTrend} // ➟ new
          totalPages={totalPages}
          initialData={payments}
          weeklyRevenue={weeklyRevenue}
        />
      </Skeleton>
    </div>
  );
};

export default Page;
