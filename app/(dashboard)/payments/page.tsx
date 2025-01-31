import { PaymentsDataTable } from "@/components/main/Payments";
import { getAllPayments, getTotalRevenue } from "@/lib/actions/payment.action";

import React from "react";
export const dynamic = "force-dynamic";
const Page = async ({ searchParams }: any) => {
  const [payments, totalRevenue] = await Promise.all([
    getAllPayments({ reverse: searchParams.reverse ?? false }),
    getTotalRevenue(),
  ]);

  return (
    <div className="h-full px-2 py-1">
      <PaymentsDataTable payments={payments} revenue={totalRevenue} />
    </div>
  );
};

export default Page;
