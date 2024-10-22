import { ServiceTabs } from "@/components/clientProfile/Service/ServiceTabs";
import CustomerChargeSheet from "@/components/shared/sheet/CustomerChargeSheet";
import { getClientsServicePreferences } from "@/lib/actions/client.action";
import { getConstant } from "@/lib/actions/constant.action";
import {
  getUnpaidClientServices,
  getAllPaidClientServices,
} from "@/lib/actions/service.action";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const [constants, client, unpaidServices, allServices] = await Promise.all([
    getConstant("Services"),
    getClientsServicePreferences({ id: params.id }),
    getUnpaidClientServices({ clientId: params.id }),
    getAllPaidClientServices({ clientId: params.id }),
  ]);

  return (
    <div className=" relative flex min-h-[120vh] w-full  p-2">
      <CustomerChargeSheet
        services={constants.value}
        client={JSON.parse(JSON.stringify(client))}
      />
      <ServiceTabs
        debts={JSON.parse(JSON.stringify(unpaidServices))}
        paid={allServices}
      />
    </div>
  );
};

export default page;
