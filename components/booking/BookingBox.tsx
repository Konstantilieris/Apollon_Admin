import React from "react";

import DatePushUrl from "../datepicker/DatePushUrl";

import Image from "next/image";
import Link from "next/link";
import Transport from "./Transport";

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
          className="text-dark200_light900 flex  flex-row items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 font-noto_sans font-semibold hover:scale-105"
          href={`/clients/${client?._id}`}
        >
          <Image
            src={"/assets/icons/client.svg"}
            alt="client icon"
            width={18}
            height={18}
            className="rounded-full"
          />
          {client?.name}
        </Link>
        <DatePushUrl nodate={false} />
        <Transport />
      </div>
    </section>
  );
};

export default BookingBox;
