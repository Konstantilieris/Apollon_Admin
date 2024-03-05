import Image from "next/image";
import React from "react";
import dynamic from "next/dynamic";
import { getAllClientsByQuery } from "@/lib/actions/client.action";
import { replacePercent20 } from "@/lib/utils";
import { getAllTransports } from "@/lib/actions/transportation.action";

import { transportColumns } from "@/components/dataTable/transportTable/TransportColumns";
import { DataTable } from "@/components/dataTable/clientsTable/data-table";

const DynamicForm = dynamic(
  () => import("@/components/form/TransportationForm"),
  {
    ssr: false,
  }
);
const page = async ({ searchParams }: any) => {
  const searchQuery = replacePercent20(searchParams.q);

  const [clients, transports] = await Promise.all([
    getAllClientsByQuery(searchQuery),
    getAllTransports(),
  ]);

  return (
    <section className="flex h-full w-full flex-col ">
      <div className="flex flex-row  gap-2">
        <Image
          src={"assets/images/taxi.svg"}
          width={30}
          height={30}
          alt="taxi"
        />
        <h1 className="text-center font-noto_sans text-[30px] font-extrabold text-yellow-500">
          PET TAXI
        </h1>
      </div>
      <DynamicForm clients={JSON.parse(clients)} />{" "}
      <DataTable columns={transportColumns} data={transports} />
    </section>
  );
};

export default page;
