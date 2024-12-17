import { IconBrandRedux } from "@tabler/icons-react";
import React from "react";

const ClientStatus = ({ status }: { status: string }) => {
  return (
    <div className="group relative flex h-[100px]  w-[300px] select-none items-center  space-x-4 rounded-lg bg-neutral-800 px-4 py-2">
      <IconBrandRedux size={40} className="animate-pulse text-yellow-600" />
      <div className="flex w-full flex-col items-start ">
        <span className="text-lg font-bold uppercase tracking-wide">
          {status === "active" ? "Ενεργός" : "Ανενεργός"}
        </span>
        <span className="text-sm leading-5 tracking-wide text-gray-400">
          Κατάσταση
        </span>
      </div>
    </div>
  );
};

export default ClientStatus;
