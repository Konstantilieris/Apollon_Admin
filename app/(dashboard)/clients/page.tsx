import { getAllClients } from "@/lib/actions/client.action";
import React from "react";

import { columns } from "@/components/dataTable/clientsTable/columns";
import { DataTable } from "@/components/dataTable/clientsTable/data-table";

const Clients = async () => {
  const clients = await getAllClients();
  const newClients = JSON.parse(clients);
  return (
    <section className="flex h-full w-full flex-col items-center ">
      <h1 className="text-dark200_light800 mb-8 font-noto_sans text-[32px] font-bold">
        Πελατολόγιο
      </h1>

      <DataTable columns={columns} data={newClients}></DataTable>
    </section>
  );
};

export default Clients;
