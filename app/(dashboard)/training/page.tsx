import TrainingForm from "@/components/form/TrainingForm";
import { getAllClientsByQuery } from "@/lib/actions/client.action";
import { replacePercent20 } from "@/lib/utils";
import React from "react";

const page = async ({ searchParams }: any) => {
  const query = replacePercent20(searchParams.q);
  const allClients = await getAllClientsByQuery({ searchQuery: query });
  const clients = JSON.parse(allClients);
  return (
    <section className="flex h-full w-full flex-col items-center p-8">
      <h1 className="text-dark300_light700 font-noto_sans text-4xl font-bold">
        {" "}
        ΕΚΠΑΙΔΕΥΣΗ
      </h1>
      <TrainingForm clients={clients} />
      <div></div>
    </section>
  );
};

export default page;
