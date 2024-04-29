import ClientStages from "@/components/createClient/ClientStages";
import { getAllClientsByQuery } from "@/lib/actions/client.action";
import { replacePercent20 } from "@/lib/utils";
import React from "react";

const page = async ({ searchParams }: any) => {
  const clients = await getAllClientsByQuery(replacePercent20(searchParams.q));
  return (
    <section className=" text-dark400_light700  relative mt-2 flex min-h-[70vh] w-full flex-col p-4">
      <ClientStages clients={clients} />
    </section>
  );
};

export default page;
