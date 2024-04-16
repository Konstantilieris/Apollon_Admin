import React from "react";
import { TypesOfBehavior } from "@/constants";
import { columns } from "@/components/dataTable/clientsTable/columns";
import { DataTable } from "@/components/dataTable/clientsTable/data-table";
import { viewClientOptions } from "@/lib/utils";
import { getAllClients } from "@/lib/actions/client.action";

const Clients = async () => {
  const newClients = JSON.parse(await getAllClients());

  const facetedFilteringOptions = {
    column_name: "dogBehavior",
    title: "Συμπεριφορά",
    options: TypesOfBehavior,
  };

  return (
    <section className=" flex w-full flex-col items-center justify-start px-4">
      <h1 className="text-dark200_light800 mb-8 font-noto_sans text-[32px] font-bold">
        Πελατολόγιο
      </h1>
      <div className="flex w-full">
        <DataTable
          columns={columns}
          data={newClients}
          facetedFilteringOptions={facetedFilteringOptions}
          viewOptions={viewClientOptions}
        />
      </div>
    </section>
  );
};

export default Clients;
