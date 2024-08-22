import { getClientById } from "@/lib/actions/client.action";

import React from "react";
import UpdateClientForm from "@/components/form/UpdateClientForm";

const page = async ({ searchParams, params }: any) => {
  const { id } = params;

  const client = await getClientById(id);
  if (!client) {
    return <section>No client Found</section>;
  }

  return (
    <section className="flex h-full w-full flex-col">
      <UpdateClientForm client={JSON.parse(JSON.stringify(client))} />
    </section>
  );
};

export default page;
