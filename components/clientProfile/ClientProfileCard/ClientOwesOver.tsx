import { IconMoneybag } from "@tabler/icons-react";
import React from "react";

const ClientOwesOver = ({ owes }: { owes: number }) => {
  return (
    <div className="group relative flex h-[100px]  w-[300px] select-none items-center  space-x-4 rounded-lg bg-neutral-800 px-4 py-2">
      <IconMoneybag size={40} className="animate-pulse text-red-500" />
      <div className="flex w-full flex-col items-start ">
        <span className="text-lg font-bold uppercase tracking-wide">
          {owes > 0 ? `Χρωστάει ${owes}€` : "Δεν χρωστάει"}
        </span>
        <span className="text-sm leading-5 tracking-wide text-gray-400">
          Χρέος
        </span>
      </div>
    </div>
  );
};

export default ClientOwesOver;
