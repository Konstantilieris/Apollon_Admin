import { getClientById } from "@/lib/actions/client.action";

import React from "react";
import UpdateClientForm from "@/components/form/UpdateClientForm";
import { getConstant } from "@/lib/actions/constant.action";

const page = async ({ searchParams, params }: any) => {
  const { id } = params;

  const client = await getClientById(id);
  if (!client) {
    return <section>No client Found</section>;
  }
  const professions = await getConstant("Professions");

  return (
    <section className="flex h-full w-full flex-col">
      <UpdateClientForm
        client={JSON.parse(JSON.stringify(client))}
        professions={professions}
      />
    </section>
  );
};

export default page;
