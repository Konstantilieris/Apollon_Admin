import React from "react";
import ClientStatsCard from "./ClientStatsCard";
import ClientAvgTime from "./ClientAvgTime";
import ClientMontlyBooking from "./ClientMontlyBooking";
import ClientLastBooking from "./ClientLastBooking";

const ClientStatsRow = ({ client }: any) => {
  return (
    <div className=" flex h-full w-full items-end justify-between p-1 ">
      <ClientStatsCard client={client} />
      <ClientAvgTime client={client} />
      <ClientMontlyBooking client={client} />
      <ClientLastBooking client={client} />
    </div>
  );
};

export default ClientStatsRow;
