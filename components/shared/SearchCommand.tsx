"use client";

import LocalSearch from "./searchBar/LocalSearch";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "@radix-ui/react-menubar";
import { cn } from "@/lib/utils";

interface Params {
  firstName: string;
  lastName: string;
  id: string;
  email: string;
  dogs?: any;
}
export function SearchCommand({
  clients,
  selectedClient,
  setSelectedClient,
  setDogs,
}: any) {
  const handleClick = ({ firstName, lastName, id, email, dogs }: Params) => {
    setSelectedClient({ firstName, lastName, id, email });
    setDogs(dogs);
  };

  return (
    <>
      <LocalSearch
        route={"/booking"}
        placeholder="Επώνυμο πελάτη"
        otherClasses="max-w-[280px]"
      />
      <ScrollArea className="custom-scrollbar background-light900_dark300 text-dark300_light700 h-72 w-[280px]  rounded-md border">
        <div className="p-4">
          {clients?.map((client: any) => (
            <div key={client._id}>
              <div
                onClick={() =>
                  handleClick({
                    firstName: client.firstName,
                    lastName: client.lastName,
                    id: client._id,
                    email: client.email,
                    dogs: client.dog,
                  })
                }
                className={cn(`text-dark300_light900 flex flex-col rounded-md px-4 py-1 font-sans
                ${
                  selectedClient?.id === client._id
                    ? "bg-celtic-green text-white"
                    : "hover:bg-light-blue "
                }
              `)}
              >
                <span className="font-bold">
                  {client.firstName} {client.lastName}
                </span>
                <span className="subtle-email">{client?.email}</span>
              </div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
