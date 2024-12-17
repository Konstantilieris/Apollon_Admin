import React from "react";
import ClientOwesOver from "./ClientOwesOver";
import ClientPaidOver from "./ClientPaidOver";

const ClientOverView = ({ client }: any) => {
  return (
    <div className=" flex w-full items-end justify-between ">
      <ClientPaidOver totalPaid={client.totalSpent} />
      <ClientOwesOver owes={client.owesTotal} />
    </div>
  );
};

export default ClientOverView;
