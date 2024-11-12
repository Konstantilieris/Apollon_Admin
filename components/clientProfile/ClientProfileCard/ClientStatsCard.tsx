import { cn } from "@/lib/utils";
import { IconExchange } from "@tabler/icons-react";
import React from "react";

const ClientStatsCard = ({ client }: any) => {
  return (
    <div className=" w-full min-w-[15vw] max-w-[17vw] select-none  self-end ">
      <div
        className={cn(
          " relative card h-36 bg-neutral-900 rounded-md shadow-sm shadow-neutral-700   max-w-[15vw] mx-auto flex flex-col justify-between p-4"
        )}
      >
        <div className="flex w-full flex-row items-center justify-between">
          <p className=" flex  w-full  flex-row min-w-[8vw] ">
            ΣΥΝΟΛΟ: {client.totalSpent} € <br />
          </p>
          <p className="flex w-full items-center justify-end">
            <IconExchange size={32} stroke={1.5} className="text-LimeGreen" />
          </p>
        </div>
        <div className="flex w-full flex-row items-center justify-between text-start">
          <p className=" flex  w-full min-w-[8vw] flex-row  text-start">
            ΠΙΣΤΩΣΗ : {client.credit ?? 0} €{" "}
          </p>
          <p className="flex w-full items-center justify-end">
            <IconExchange size={32} className="  text-blue-500" />
          </p>
        </div>
        <div className="flex w-full flex-row items-center justify-between text-start">
          <p className=" flex  w-full min-w-[8vw] flex-row  text-start">
            ΧΡΕΟΣ : {client.owesTotal} €{" "}
          </p>
          <p className="flex w-full items-center justify-end">
            <IconExchange size={32} className="  text-red-500" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientStatsCard;
