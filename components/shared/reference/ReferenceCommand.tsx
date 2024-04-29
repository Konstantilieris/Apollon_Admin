"use client";

import { Separator } from "@radix-ui/react-menubar";
import { cn } from "@/lib/utils";
import LocalSearch from "../LocalSearch";
import { ScrollArea } from "@radix-ui/react-scroll-area";
interface Params {
  firstName: string;
  lastName: string;
  id: string;
  email: string;
}
const ReferenceCommand = ({
  clients,
  selectedClient,
  setSelectedClient,
  setReferenceChoice,
}: any) => {
  const handleClick = ({ firstName, lastName, id, email }: Params) => {
    setSelectedClient({ firstName, lastName, id, email });
    setReferenceChoice({ clientId: id });
  };
  return (
    <>
      <LocalSearch
        route={"/form"}
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
                  })
                }
                className={cn(`text-dark300_light900 flex flex-col rounded-md px-4 py-1 font-noto_sans
              ${
                selectedClient?.email === client.email
                  ? "bg-celtic-green text-white"
                  : "hover:bg-light-blue "
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
};

export default ReferenceCommand;
