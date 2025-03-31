import React from "react";

import ClientTabs from "@/components/clientProfile2/Tabs";
import { getClientById2 } from "@/lib/actions/client.action";
const page = async ({ params }: any) => {
  const client = await getClientById2(params.id);
  return (
    <section>
      <ClientTabs client={JSON.parse(JSON.stringify(client))} />
    </section>
  );
};

export default page;
