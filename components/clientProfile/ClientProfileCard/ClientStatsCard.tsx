"use client";

import { getBookingLength } from "@/lib/actions/client.action";
import { IconFileReport } from "@tabler/icons-react";
import { memo, useEffect, useState } from "react";

const ClientStatsCard = ({ client }: any) => {
  const [bookingLength, setBookingLength] = useState(0);
  useEffect(() => {
    const fetchBookingLength = async () => {
      const length = await getBookingLength(client._id);
      setBookingLength(length);
    };
    fetchBookingLength();
  }, []);
  return (
    <div className="group relative flex h-[100px]  w-[300px] select-none items-center  space-x-4 rounded-lg bg-neutral-800 px-4 py-2">
      <IconFileReport size={40} className=" text-yellow-600" />
      <div className="flex w-full flex-col items-start ">
        <span className="text-lg font-bold uppercase tracking-wide">
          {bookingLength}
        </span>
        <span className="text-sm leading-5 tracking-wide text-gray-400">
          Αριθμός Κρατήσεων
        </span>
      </div>
    </div>
  );
};

export default memo(ClientStatsCard, (prevProps, nextProps) => {
  return prevProps.client._id === nextProps.client._id; // Prevent re-renders if client._id is unchanged
});
