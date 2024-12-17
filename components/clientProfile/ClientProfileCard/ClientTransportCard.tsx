"use client";

import React, { useMemo } from "react";
import ClientTransferFee from "../Fees/ClientTransferFee";
import ClientBookingPrice from "../Fees/ClientBookingPrice";

const ClientTransportCard = ({ client }: any) => {
  const transportationFee = useMemo(() => {
    const fee = client.serviceFees.filter(
      (service: any) => service.type === "transportFee"
    )[0];
    return fee ? fee.value : 0; // Safely handle undefined cases
  }, [client.serviceFees]);
  const bookingFee = useMemo(() => {
    const fee = client.serviceFees.filter(
      (service: any) => service.type === "bookingFee"
    )[0];
    return fee ? fee.value : 0; // Safely handle undefined cases
  }, [client.serviceFees]);

  return (
    <>
      <ClientTransferFee
        id={JSON.parse(JSON.stringify(client?._id))}
        transportationFee={transportationFee}
        name={client.name}
      />
      <ClientBookingPrice
        id={JSON.parse(JSON.stringify(client?._id))}
        price={bookingFee}
        name={client.name}
      />
    </>
  );
};

export default ClientTransportCard;
