import { getClientById } from "@/lib/actions/client.action";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IDog } from "@/database/models/client.model";
import RowRenderer from "@/components/clientProfile/ClientProfileCard/RowRenderer";
import ChipTabs from "@/components/clientProfile/ClientProfileCard/ChipTabs";
export const dynamic = "force-dynamic";
const ClientRow = async ({ id }: { id: string }) => {
  const client = await getClientById(id);

  const fullName = client?.name || ""; // Safely handle null or undefined
  const initials = fullName
    .split(" ") // Split the name into parts
    .map((part: string[]) => part[0]) // Get the first letter of each part
    .join("") // Combine the initials
    .toUpperCase(); // Ensure they are uppercase
  return (
    <section className="flex  w-full flex-col">
      <div className="flex h-full max-h-[33vh] min-w-full flex-row p-2">
        <div className="flex h-full w-full min-w-[300px] flex-col rounded-xl bg-dark-100 p-4">
          <div className="ml-4  flex w-full flex-row items-center gap-4">
            <div className="flex max-h-[50px] min-h-[30px] items-center gap-2 py-1">
              <span className="h-[50px] w-[4px] animate-pulse rounded-lg bg-yellow-500" />
              <span className=" min-w-[10vw] text-lg tracking-wide">
                {" "}
                Client Profile
              </span>
            </div>
            <div className="flex w-full flex-row items-center justify-end gap-2 ">
              <ChipTabs />
            </div>
          </div>
          <div className="mt-8 flex h-full w-full flex-row px-8 py-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex h-full w-full flex-col gap-4 p-4">
              <span className=" text-2xl tracking-wide">
                {client?.name ?? ""}
              </span>
              <div className="flex flex-row justify-between ">
                <div className="flex flex-col">
                  <span className="text-lg leading-8 tracking-wide text-gray-400">
                    Κατοικίδια
                  </span>
                  <span className="text-lg leading-8 tracking-widest text-light-900">
                    {client?.dog.map((dog: IDog) => dog?.name).join(", ")}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg leading-8 tracking-wide text-gray-400">
                    Επικοινωνία
                  </span>
                  <span className="text-lg leading-8 tracking-widest text-light-900">
                    {client?.phone?.telephone}-{client?.phone?.mobile}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg leading-8 tracking-wide text-gray-400">
                    Email
                  </span>
                  <span className="text-lg leading-8 tracking-widest text-light-900">
                    {client?.email ?? ""}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg leading-8 tracking-wide text-gray-400">
                    Τοποθεσία
                  </span>
                  <span className="text-lg leading-8 tracking-widest text-light-900">
                    {client?.location?.city ?? ""}
                  </span>
                </div>
              </div>
              <div className=" flex h-full w-full flex-row justify-between p-2">
                <RowRenderer client={JSON.parse(JSON.stringify(client))} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientRow;
