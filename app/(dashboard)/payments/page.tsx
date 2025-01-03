import { PaymentsDataTable } from "@/components/main/Payments";
import { getAllServicesWithClientNames } from "@/lib/actions/service.action";
import React from "react";
export const dynamic = "force-dynamic";
const Page = async () => {
  const services = JSON.parse(
    JSON.stringify(await getAllServicesWithClientNames())
  );

  return (
    <div className="h-full px-2 py-1">
      <PaymentsDataTable services={services} />
    </div>
  );
};

export default Page;
