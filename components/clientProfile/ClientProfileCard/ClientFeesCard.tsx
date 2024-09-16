import ClientBookingPrice from "@/components/booking/ClientBookingPrice";
import ClientTransferFee from "@/components/booking/ClientTransferFee";
import { cn } from "@/lib/utils";
import { IconCoins } from "@tabler/icons-react";
import React from "react";

const ClientFeesCard = ({ client }: any) => {
  return (
    <div className="  self-center  ">
      <div
        className={cn(
          " relative card h-36 bg-[#12002b] rounded-md shadow-md shadow-purple-800  min-w-[25vw] mx-auto flex flex-col justify-between p-4"
        )}
      >
        <div className="absolute left-0 top-0 h-full w-full  opacity-0 "></div>
        <div className="z-10 flex flex-row items-center justify-between space-x-4">
          <IconCoins size={24} />

          <p className="relative z-10 text-base font-normal text-light-900">
            ΣΤΑΘΕΡΕΣ ΤΙΜΕΣ
          </p>
        </div>
        <div className=" flex w-full items-center gap-3 justify-between z-40">
          <ClientTransferFee
            transportationFee={client.transportFee}
            id={JSON.parse(JSON.stringify(client?._id))}
            name={client.name}
          />
          <ClientBookingPrice
            id={JSON.parse(JSON.stringify(client?._id))}
            price={client.bookingFee}
            name={client.name}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientFeesCard;
