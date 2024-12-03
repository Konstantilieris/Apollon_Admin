import DeleteBooking from "@/components/bookingManagement/DeleteBooking";
import ChangeDates from "@/components/editbooking/ChangeDates";
import UpdateTNT from "@/components/editbooking/ChangeTime";

import { getBookingById } from "@/lib/actions/booking.action";
import { formatDate, formatTime } from "@/lib/utils";
import Image from "next/image";

import React from "react";

const EditChange = async ({ params }: any) => {
  const booking = JSON.parse(await getBookingById(params.id));

  return (
    <section className=" flex h-full w-full flex-col overflow-y-auto px-4 py-8 dark:bg-neutral-800 ">
      <div className="flex flex-row items-center justify-between px-2">
        <span className="flex flex-row items-center gap-2 ">
          <Image
            src={"/assets/icons/client.svg"}
            alt="client"
            width={30}
            height={30}
            className="invert dark:invert-0"
          />{" "}
          {booking?.client?.clientName}
        </span>
        <span className="flex flex-row items-center gap-2">
          <Image
            src={"/assets/icons/dog.svg"}
            alt="dog"
            width={30}
            height={30}
            className="invert dark:invert-0"
          />{" "}
          {booking?.dogs &&
            booking?.dogs?.map((dog: any) => dog.dogName).join(", ")}
        </span>
      </div>

      <div className="my-8 flex flex-col">
        <div className="  mt-2 flex w-full flex-row flex-wrap justify-between gap-4 rounded-lg bg-neutral-200 px-4 py-5 font-semibold dark:bg-dark-100">
          <span className="items-center text-dark-100 dark:text-green-300">
            {formatDate(new Date(booking.fromDate), "el")}-{" "}
            {formatDate(new Date(booking.toDate), "el")}
          </span>
          <span className="  text-dark-100 dark:text-green-300">
            {booking?.flag1 ? "Παραλαβη " : "Άφιξη  "}
            {formatTime(new Date(booking.fromDate), "el")} -
            {booking?.flag2 ? "Παράδοση " : "Αναχώρηση "}{" "}
            {formatTime(new Date(booking.toDate), "el")}
          </span>
          <span className=" text-dark-100 dark:text-green-300">
            Σύνολικο Κόστος {booking?.totalAmount} €
          </span>
        </div>
      </div>

      <ChangeDates
        initialStartDate={booking.fromDate}
        initialEndDate={booking.toDate}
        id={booking._id}
        transportFee={booking.client.transportFee}
        taxiArrival={booking.flag1}
        taxiDeparture={booking.flag2}
        bookingFee={booking.client.bookingFee}
        amount={booking.totalAmount}
      />

      <UpdateTNT
        id={booking._id}
        transportFee={booking.client.transportFee}
        initialDate={booking.fromDate}
        type="flag1"
        hasTransport={booking.flag1}
      />
      <UpdateTNT
        id={booking._id}
        transportFee={booking.client.transportFee}
        initialDate={booking.toDate}
        type="flag2"
        hasTransport={booking.flag2}
      />
      <DeleteBooking
        bookingId={booking._id}
        clientId={booking.client.clientId}
      />
    </section>
  );
};

export default EditChange;
