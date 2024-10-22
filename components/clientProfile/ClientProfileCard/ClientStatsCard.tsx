import { cn } from "@/lib/utils";
import { IconExchange } from "@tabler/icons-react";
import React from "react";

const ClientStatsCard = ({ client }: any) => {
  return (
    <div className=" w-full min-w-[15vw] max-w-[16vw] self-end  ">
      <div
        className={cn(
          " relative card h-36 bg-neutral-900 rounded-md shadow-sm shadow-yellow-600  max-w-[15vw] mx-auto flex flex-col justify-between p-4"
        )}
      >
        <div className="flex w-full flex-row items-center justify-between">
          <p className="flex w-full items-center justify-start">
            <IconExchange size={32} stroke={1.5} className="text-LimeGreen" />
          </p>
          <p className="flex w-full justify-start pl-2">
            Συνολo : {client.totalSpent} € <br />
          </p>
        </div>
        <div className="flex w-full flex-row items-center justify-between text-start">
          <p className="flex w-full items-center justify-start">
            <IconExchange size={32} className="  text-red-500" />
          </p>
          <p className=" w-full  pl-2 text-start">
            ΧΡΕΟΣ : {client.owesTotal} €{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientStatsCard;
