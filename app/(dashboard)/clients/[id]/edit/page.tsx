import { getClientById } from "@/lib/actions/client.action";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <ScrollArea className="relative flex h-full w-full  flex-col p-4">
      <UpdateClientForm
        client={JSON.parse(JSON.stringify(client))}
        professions={professions}
      />
    </ScrollArea>
  );
};

export default page;
