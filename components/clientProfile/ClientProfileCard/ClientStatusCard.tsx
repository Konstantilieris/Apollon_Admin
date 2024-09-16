import React from "react";

import { cn, formatDateString } from "@/lib/utils";
import { IconDeviceWatchStats } from "@tabler/icons-react";

const ClientStatusCard = ({ client }: any) => {
  return (
    <div className=" w-full max-w-xs self-center  ">
      <div
        className={cn(
          " relative card h-36 bg-[#12002b] rounded-md shadow-md shadow-purple-800  max-w-sm mx-auto flex flex-col justify-between p-4"
        )}
      >
        <div className="absolute left-0 top-0 h-full w-full  opacity-0 "></div>
        <div className="z-10 flex flex-row items-center justify-between space-x-4">
          <IconDeviceWatchStats size={24} />

          <p className="relative z-10 text-base font-normal text-light-900">
            {client.status}
          </p>
        </div>
        <div className=" flex w-full items-center gap-3 justify-between">
          <span className="text-sm text-light-700">
            ΤΕΛΕΥΤΑΙΑ ΔΡΑΣΤΗΡΙΟΤΗΤΑ
          </span>
          <span className="text-sm text-light-700">
            {formatDateString(client.lastActivity)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClientStatusCard;
