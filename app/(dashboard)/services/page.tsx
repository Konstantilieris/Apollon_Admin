import ServiceModalProvider from "@/components/service/ServiceModalProvider";
import { ServicesTable } from "@/components/service/ServiceTable";
import { getAllServices } from "@/lib/actions/service.action";
import React from "react";

const Page = async ({ searchParams }: any) => {
  const services = await getAllServices({ paid: searchParams.paid ?? false });
  return (
    <div className="h-full px-2 py-1">
      <ServiceModalProvider />
      <ServicesTable services={services} />
    </div>
  );
};

export default Page;
