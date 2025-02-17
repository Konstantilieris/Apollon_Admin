import { ServiceTabs } from "@/components/clientProfile/Service/Tabs/ServiceTabs";
import CustomerChargeSheet from "@/components/shared/sheet/CustomerChargeSheet";
import { getClientsServicePreferences } from "@/lib/actions/client.action";
import { getConstant } from "@/lib/actions/constant.action";
import { getPaymentsByClientId } from "@/lib/actions/payment.action";
import {
  getUnpaidClientServices,
  getAllPaidClientServices,
} from "@/lib/actions/service.action";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const [constants, payments, client, unpaidServices, allServices] =
    await Promise.all([
      getConstant("Services"),
      getPaymentsByClientId({ clientId: params.id }),
      getClientsServicePreferences({ id: params.id }),
      getUnpaidClientServices({ clientId: params.id }),
      getAllPaidClientServices({ clientId: params.id }),
    ]);

  return (
    <div className=" relative flex min-h-[120vh] w-full  bg-neutral-900 p-2">
      <CustomerChargeSheet
        services={constants.value}
        client={JSON.parse(JSON.stringify(client))}
      />

      <ServiceTabs
        debts={JSON.parse(JSON.stringify(unpaidServices))}
        paid={allServices}
        payments={payments}
      />
    </div>
  );
};

export default page;
