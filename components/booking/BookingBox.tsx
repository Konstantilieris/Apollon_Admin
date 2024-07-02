import React from "react";

import DatePushUrl from "../datepicker/DatePushUrl";

import Image from "next/image";

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
        <span className="text-dark200_light900 flex  flex-row items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 font-noto_sans font-semibold">
          <Image
            src={"/assets/icons/client.svg"}
            alt="client icon"
            width={18}
            height={18}
            className="rounded-full"
          />
          {client?.firstName.slice(0, 1)}.{client?.lastName}
        </span>
        <DatePushUrl nodate={false} />
      </div>
    </section>
  );
};

export default BookingBox;
