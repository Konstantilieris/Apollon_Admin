import { ServiceTabs } from "@/components/clientProfile/Service/ServiceTabs";
import {
  getUnpaidClientServices,
  getAllPaidClientServices,
} from "@/lib/actions/service.action";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const [unpaidServices, allServices] = await Promise.all([
    getUnpaidClientServices({ clientId: params.id }),
    getAllPaidClientServices({ clientId: params.id }),
  ]);
  return (
    <div className="no-scrollbar relative flex min-h-[120vh] w-full overflow-auto p-2">
      <button className="absolute right-10 top-8">ΧΡΕΩΣΗ</button>
      <ServiceTabs
        debts={JSON.parse(JSON.stringify(unpaidServices))}
        paid={allServices}
      />
    </div>
  );
};

export default page;
