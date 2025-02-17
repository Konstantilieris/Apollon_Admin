import { getAverageBookingsPerMonth } from "@/lib/actions/client.action";
import { IconChartInfographic } from "@tabler/icons-react";
import React, { memo } from "react";

const ClientMontlyBooking = async ({ client }: any) => {
  const bookingLength = await getAverageBookingsPerMonth(client._id);
  return (
    <div className="group relative flex h-[100px]  w-[300px] select-none items-center  space-x-4 rounded-lg bg-neutral-800 px-4 py-2">
      <IconChartInfographic size={40} className=" text-yellow-600" />
      <div className="flex w-full flex-col items-start ">
        <span className="text-lg font-bold uppercase tracking-wide">
          {bookingLength}
        </span>
        <span className="text-sm leading-5 tracking-wide text-gray-400">
          Αριθμός Κρατήσεων ανα Μήνα
        </span>
      </div>
    </div>
  );
};

export default memo(ClientMontlyBooking, (prevProps, nextProps) => {
  return prevProps.client._id === nextProps.client._id; // Prevent re-renders if client._id is unchanged
});
