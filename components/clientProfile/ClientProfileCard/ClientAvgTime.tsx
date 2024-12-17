import { getAverageStay } from "@/lib/actions/client.action";
import { IconClockHour2Filled } from "@tabler/icons-react";
import React, { memo, useEffect } from "react";

const ClientAvgTime = ({ client }: any) => {
  const [avgTIme, setAvgTime] = React.useState<number>(0);
  useEffect(() => {
    const fetchAvgTime = async () => {
      const avgTime = await getAverageStay(client._id);
      setAvgTime(avgTime);
    };
    fetchAvgTime();
  }, []);
  return (
    <div className="group relative flex h-[100px]  w-[300px] select-none items-center  space-x-4 rounded-lg bg-neutral-800 px-4 py-2">
      <IconClockHour2Filled
        size={40}
        className="animate-pulse text-yellow-600"
      />
      <div className="flex w-full flex-col items-start ">
        <span className="text-lg font-bold uppercase tracking-wide">
          {avgTIme}{" "}
          <span className="text-sm tracking-widest text-light-500">ημερες</span>
        </span>
        <span className="text-sm leading-5 tracking-wide text-gray-400">
          Μέσος Χρόνος Παραμονής
        </span>
      </div>
    </div>
  );
};

export default memo(ClientAvgTime, (prevProps, nextProps) => {
  return prevProps.client._id === nextProps.client._id; // Prevent re-renders if client._id is unchanged
});
