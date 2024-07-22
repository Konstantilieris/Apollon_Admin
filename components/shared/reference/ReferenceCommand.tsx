"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@radix-ui/react-menubar";
import { cn } from "@/lib/utils";
import LocalSearch from "../searchBar/LocalSearch";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Input } from "@/components/ui/input";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ReferenceCommand = ({ clients, value, onChange }: any) => {
  const [reference, setReference] = React.useState("");

  const [selectedClient, setSelectedClient] = React.useState<string>("");
  const popoverRef = React.useRef(null);
  return (
    <div className="relative flex w-full">
      {reference !== "other" && (
        <Select
          onValueChange={(value) => {
            setSelectedClient("");
            onChange({});
            setReference(value);
            switch (value) {
              case "client":
                onChange({ clientId: "" });
                break;
              case "google":
                onChange({ google: true });
                break;
              case "other":
                onChange({ other: "" });
                break;
              default:
                break;
            }
          }}
          value={reference}
        >
          <SelectTrigger className="background-light800_dark300 text-dark300_light700 paragraph-regular light-border-2 min-h-[56px] max-w-[246px] rounded-lg p-2 font-sans ">
            <SelectValue placeholder="Σύσταση" />
          </SelectTrigger>
          <SelectContent className="background-light900_dark300 text-dark300_light700 rounded-lg p-4 font-sans  ">
            <SelectItem
              className={`rounded-lg hover:bg-sky-blue  `}
              value="client"
            >
              Πελάτης
            </SelectItem>
            <SelectItem
              className={`rounded-lg hover:bg-sky-blue  `}
              value="google"
            >
              Google
            </SelectItem>
            <SelectItem
              className={`rounded-lg hover:bg-sky-blue  `}
              value="other"
            >
              Άλλο
            </SelectItem>
          </SelectContent>
        </Select>
      )}
      {reference === "other" && (
        <div className="background-light900_dark300 no-focus text-dark300_light700 paragraph-regular light-border-2 flex max-w-[200px]  flex-row items-center rounded-lg bg-light-900 dark:bg-dark-400 ">
          <span
            onClick={() => {
              setReference("");
              onChange({});
            }}
            className="ml-2 rounded-lg bg-light-500 px-2 py-1 text-black hover:scale-105 hover:text-red-500"
          >
            X
          </span>
          <Input
            type="text"
            value={value?.other || ""}
            onChange={(e) => {
              onChange({ other: e.target.value });
            }}
            className="no-focus   text-dark300_light700 paragraph-regular  form_input w-full border-none bg-transparent"
          />
        </div>
      )}
      {reference === "client" && (
        <Popover open={reference === "client"}>
          <PopoverTrigger></PopoverTrigger>
          <PopoverContent
            className=" mr-40 w-80 bg-white dark:bg-dark-100"
            align="center"
            side="bottom"
            sideOffset={10}
            ref={popoverRef}
          >
            <LocalSearch
              route={"/form"}
              placeholder="Επώνυμο πελάτη"
              otherClasses="max-w-[280px] mb-4"
            />
            <ScrollArea className="custom-scrollbar background-light900_dark300 text-dark300_light700 h-72 w-[280px]  rounded-md border">
              <div className="p-4">
                {clients?.map((client: any) => (
                  <div key={client._id}>
                    <div
                      onClick={() => {
                        onChange({ clientId: client._id });
                        setSelectedClient(client.name);
                        setReference("");
                      }}
                      className={cn(`text-dark300_light900 flex flex-col rounded-md px-4 py-1 font-sans hover:scale-105
             
            `)}
                    >
                      <span className="font-bold">{client?.name}</span>
                      <span className="subtle-email">{client.email}</span>
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      )}
      {value.clientId && (
        <span className="small-regular ml-4 self-center font-sans text-indigo-300">
          {selectedClient}
        </span>
      )}
    </div>
  );
};

export default ReferenceCommand;
