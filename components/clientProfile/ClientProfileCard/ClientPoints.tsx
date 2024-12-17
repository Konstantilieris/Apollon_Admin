import { IconStarsFilled } from "@tabler/icons-react";
import React from "react";

const ClientPoints = ({ points }: { points: number }) => {
  return (
    <div className="group relative flex h-[100px]  w-[300px] select-none items-center  space-x-4 rounded-lg bg-neutral-800 px-4 py-2">
      <IconStarsFilled size={40} className="animate-pulse text-yellow-600" />
      <div className="flex flex-col">
        <span className="text-lg font-bold uppercase tracking-wide">
          {points}
        </span>
        <span className="text-sm leading-5 tracking-wide text-gray-400">
          Πόντοι
        </span>
      </div>
    </div>
  );
};

export default ClientPoints;
