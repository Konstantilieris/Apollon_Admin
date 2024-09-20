import React from "react";

import { cn, formatDateString } from "@/lib/utils";
import { IconCircleFilled, IconDeviceWatchStats } from "@tabler/icons-react";

const ClientStatusCard = ({ client }: any) => {
  const renderStatus = () => {
    switch (client.status) {
      case "active":
        return "Ενεργος";
      case "inactive":
        return "Ανενεργος";
      case "suspended":
        return "Αναστελλεται";
      default:
        return "Ενεργος";
    }
  };
  return (
    <div className=" w-full min-w-[15vw] max-w-[16vw] self-end  ">
      <div
        className={cn(
          " relative card h-36 bg-[#12002b] rounded-md shadow-md shadow-purple-800  max-w-sm mx-auto flex flex-col justify-between p-4"
        )}
      >
        <div className="absolute left-0 top-0 h-full w-full  opacity-0 "></div>
        <div className="z-10 flex flex-row items-center justify-between space-x-4">
          <p className="flex w-full">
            <IconDeviceWatchStats size={24} />
          </p>
          <p className="flex w-full items-center gap-2 pl-8 uppercase">
            <IconCircleFilled
              size={16}
              className={cn("animate-pulse", {
                "text-green-500": client.status === "active",
                "text-yellow-500": client.status === "inactive",
                "text-red-500": client.status === "suspended",
              })}
            />
            {renderStatus()}
          </p>
        </div>
        <div className=" flex w-full items-center justify-between ">
          <span className="text-[1rem] text-light-700">Τελευταία Ενέργεια</span>
          <span className="text-[1rem] text-light-700">
            {formatDateString(client.lastActivity)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClientStatusCard;
