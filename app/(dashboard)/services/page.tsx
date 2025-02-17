import { ServicesTable } from "@/components/ServicesPageComponents/ServiceTable";
import { getAllServices } from "@/lib/actions/service.action";
import React from "react";
export const dynamic = "force-dynamic";
const Page = async ({ searchParams }: any) => {
  const services = await getAllServices({ paid: searchParams.paid ?? true });

  return (
    <div className="h-full px-2 py-1">
      <ServicesTable services={services} />
    </div>
  );
};

export default Page;
