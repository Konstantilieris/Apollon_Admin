import { getLastBooking } from "@/lib/actions/client.action";

import { IconBedFilled } from "@tabler/icons-react";
import React, { memo } from "react";
import moment from "moment";
const ClientLastBooking = async ({ client }: any) => {
  const lastBooking = await getLastBooking(client._id);
  const formattedDate = (date: Date) => moment(date).format("DD/MM/YYYY");
  if (!lastBooking) {
    return (
      <div className="group relative flex h-[100px]  w-[300px] select-none items-center  space-x-4 rounded-lg bg-neutral-800 px-4 py-2">
        <IconBedFilled size={40} className=" text-yellow-600" />
        <div className="flex w-full flex-col items-start ">
          <span className="text-lg font-bold uppercase tracking-wide">N/A</span>
          <span className="text-sm leading-5 tracking-wide text-gray-400">
            N/A
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="group relative flex h-[100px]  w-[300px] select-none items-center  space-x-4 rounded-lg bg-neutral-800 px-4 py-2">
      <IconBedFilled size={40} className=" text-yellow-600" />
      <div className="flex w-full flex-col items-start ">
        <span className="text-lg font-bold uppercase tracking-wide">
          {lastBooking.totalAmount}€{" "}
          <span className="text-sm tracking-widest text-light-500"></span>
        </span>
        <span className="text-sm leading-5 tracking-wide text-gray-400">
          {formattedDate(new Date(lastBooking.fromDate))}-
          {formattedDate(new Date(lastBooking.toDate))}
        </span>
      </div>
    </div>
  );
};

export default memo(ClientLastBooking, (prevProps, nextProps) => {
  return prevProps.client._id === nextProps.client._id; // Prevent re-renders if client._id is unchanged
});
