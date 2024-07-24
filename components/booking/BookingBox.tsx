import React from "react";

import DatePushUrl from "../datepicker/DatePushUrl";

import Image from "next/image";
import Link from "next/link";
import Transport from "./Transport";
import ClientBookingPrice from "./ClientBookingPrice";
import ClientTransferFee from "./ClientTransferFee";

const BookingBox = async ({
  client,
  searchParams,
}: {
  client: any | undefined;
  searchParams: any;
}) => {
  return (
    <section className="total-balance background-light900_dark200 mt-4">
      <div className="flex w-full flex-row items-center   gap-8 ">
        <Link
          className="text-dark200_light900 flex  flex-row items-center gap-2 rounded-xl border-[3px] border-indigo-500 px-4 py-2 font-sans font-semibold hover:scale-105 dark:bg-dark-300 "
          href={`/clients/${client?._id}`}
        >
          <Image
            src={"/assets/icons/client.svg"}
            alt="client icon"
            width={24}
            height={24}
            className="rounded-full "
          />
          {client?.name}
        </Link>
        <ClientBookingPrice
          id={JSON.parse(JSON.stringify(client?._id))}
          price={client.bookingPerDay}
          name={client.name}
        />
        <ClientTransferFee
          transportationFee={client.transportFee}
          id={JSON.parse(JSON.stringify(client?._id))}
          name={client.name}
        />
        <DatePushUrl nodate={false} disabled={true} />
        <Transport />
      </div>
    </section>
  );
};

export default BookingBox;
