import { getClientById } from "@/lib/actions/client.action";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IDog } from "@/database/models/client.model";
import RowRenderer from "@/components/clientProfile/ClientProfileCard/RowRenderer";
import ChipTabs from "@/components/clientProfile/ClientProfileCard/ChipTabs";
import { HeroSectionWithBeamsAndGrid } from "./BackgroundAnimation";

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
    <section className="relative flex min-h-[200px] w-full flex-col overflow-y-hidden bg-neutral-950">
      <HeroSectionWithBeamsAndGrid />
      <div className="mt-4 flex h-full w-full flex-row px-8 py-4">
        <Avatar className="h-auto max-h-[10vh] w-auto max-w-[10vh]">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex w-full flex-col gap-2 p-2">
          <span className="text-sm tracking-wide sm:text-lg md:text-xl">
            {client?.name ?? ""}
          </span>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400 md:text-lg">
                Κατοικίδια
              </span>
              <span className="text-sm text-light-900 md:text-lg">
                {client?.dog.map((dog: IDog) => dog?.name).join(", ")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex h-full w-full flex-col items-center gap-2 self-start">
          <ChipTabs />

          <RowRenderer client={JSON.parse(JSON.stringify(client))} />
        </div>
      </div>
    </section>
  );
};

export default ClientRow;
