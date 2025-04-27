// app/payments/page.tsx
import { PaymentsTable } from "@/components/clientProfile2/Financial/Payment/Payments-Table";
import {
  getAllPayments,
  GetPaymentsFilters,
  getTotalRevenue,
} from "@/lib/actions/payment.action";
import { intToDate } from "@/lib/utils";
import React from "react";

export const dynamic = "force-dynamic";

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

  const [{ rows: payments, totalCount }, totalRevenue] = await Promise.all([
    getAllPayments(filters),
    getTotalRevenue(),
  ]);

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="h-full px-2 py-1">
      <PaymentsTable
        totalAmount={totalRevenue}
        totalPages={totalPages}
        initialData={payments}
      />
    </div>
  );
};

export default Page;
