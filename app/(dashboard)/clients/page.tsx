import { getAllClients } from "@/lib/actions/client.action";
import React from "react";
import { TypesOfBehavior } from "@/constants";
import { columns } from "@/components/dataTable/clientsTable/columns";
import { DataTable } from "@/components/dataTable/clientsTable/data-table";
import { viewClientOptions } from "@/lib/utils";
const Clients = async () => {
  const clients = await getAllClients();
  const newClients = JSON.parse(clients);
  const facetedFilteringOptions = {
    column_name: "dog_behavior",
    title: "Συμπεριφορά",
    options: TypesOfBehavior,
  };

  return (
    <section className="flex h-screen w-full flex-col items-center ">
      <h1 className="text-dark200_light800 mb-8 font-noto_sans text-[32px] font-bold">
        Πελατολόγιο
      </h1>

      <DataTable
        columns={columns}
        data={newClients}
        facetedFilteringOptions={facetedFilteringOptions}
        viewOptions={viewClientOptions}
      ></DataTable>
    </section>
  );
};

export default Clients;
