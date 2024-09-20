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
    <div className="no-scrollbar mb-40 flex min-h-[120vh] w-full overflow-auto p-2">
      <ServiceTabs
        debts={JSON.parse(JSON.stringify(unpaidServices))}
        paid={allServices}
      />
    </div>
  );
};

export default page;
