import ClientBookingPrice from "@/components/clientProfile/Fees/ClientBookingPrice";
import ClientTransferFee from "@/components/clientProfile/Fees/ClientTransferFee";
import { cn } from "@/lib/utils";
import { IconCoins } from "@tabler/icons-react";
import React from "react";

const ClientFeesCard = ({ client }: any) => {
  return (
    <div className=" w-full min-w-[15vw] max-w-[16vw] select-none  self-end ">
      <div
        className={cn(
          " relative card h-36 bg-neutral-900 rounded-md shadow-sm shadow-neutral-700   max-w-sm mx-auto flex flex-col justify-between p-4"
        )}
      >
        <div className="z-10 flex w-full flex-row items-center justify-between">
          <p className="relative z-10 text-base font-normal text-light-900">
            ΣΤΑΘΕΡΕΣ ΤΙΜΕΣ
          </p>
          <IconCoins size={24} className="text-yellow-600" />
        </div>
        <div className="mt-4 flex flex-row justify-between">
          <div className="flex w-full flex-col items-start text-[0.9rem] text-light-900">
            <p className="flex flex-row"> ΜΕΤΑΦΟΡΑ {client.transportFee} €</p>
          </div>
          <div className="flex w-full flex-col pl-4  text-[0.9rem] text-light-900">
            <p className="flex w-full flex-row gap-2">
              ΗΜΕΡΗΣΙΟ {client.bookingFee} €
            </p>
          </div>
        </div>
        <div className=" z-40 mt-3 flex w-full items-center justify-between gap-8">
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
