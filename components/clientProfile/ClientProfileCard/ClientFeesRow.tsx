import React from "react";

import ClientTransportCard from "./ClientTransportCard";

const ClientFeesRow = ({ client }: any) => {
  return (
    <div className=" flex w-full items-end justify-start gap-20 ">
      <ClientTransportCard client={client} />
    </div>
  );
};

export default ClientFeesRow;