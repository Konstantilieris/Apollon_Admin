"use client";

import LocalSearch from "./LocalSearch";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "@radix-ui/react-menubar";
import { cn } from "@/lib/utils";

export function SearchCommand({
  clients,
  selectedClient,
  setSelectedClient,
}: any) {
  const handleClick = ({ firstName, lastName, id, email }: any) => {
    setSelectedClient({ firstName, lastName, id, email });
  };
  return (
    <>
      <LocalSearch
        route={"/rooms"}
        placeholder="Επώνυμο πελάτη"
        otherClasses="max-w-[280px]"
      />
      <ScrollArea className="custom-scrollbar h-72 w-[280px] rounded-md border">
        <div className="p-4">
          {clients.map((client: any) => (
            <div key={client._id}>
              <div
                onClick={() =>
                  handleClick({
                    firstName: client.firstName,
                    lastName: client.lastName,
                    id: client._id,
                    email: client.email,
                  })
                }
                className={cn(`text-dark300_light900 flex flex-col rounded-md px-4 py-1 font-noto_sans
                ${
                  selectedClient?.email === client.email
                    ? "bg-celtic-green text-white"
                    : "hover:bg-light-blue"
                }
              `)}
              >
                <span className="font-bold">
                  {client.firstName} {client.lastName}
                </span>
                <span className="subtle-email">{client.email}</span>
              </div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
