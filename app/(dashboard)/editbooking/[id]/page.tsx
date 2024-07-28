import ChangeDates from "@/components/editbooking/ChangeDates";
import { getBookingById } from "@/lib/actions/booking.action";
import { formatDate, formatTime } from "@/lib/utils";

import React from "react";

const EditChange = async ({ params }: any) => {
  const booking = JSON.parse(await getBookingById(params.id));

  return (
    <section className="mt-12 flex h-full w-full flex-col py-8 font-sans">
      <div className="mx-auto flex  flex-col  gap-4 text-lg">
        <h1 className="text-xl">
          {" "}
          Επεξεργασία Κράτησης{"  "}
          <span className="font-sans font-semibold text-indigo-600">
            {booking?.client?.clientName}
          </span>
        </h1>
        <span className="items-center text-green-300">
          {formatDate(new Date(booking.fromDate), "el")}-{" "}
          {formatDate(new Date(booking.toDate), "el")}
        </span>
        <span className=" mx-auto text-green-300">
          {booking?.flag1 ? "Παραλαβη " : "Άφιξη  "}
          {formatTime(new Date(booking.fromDate), "el")} -
          {booking?.flag2 ? "Παράδοση " : "Αναχώρηση "}{" "}
          {formatTime(new Date(booking.toDate), "el")}
        </span>
        <span className="mx-auto text-green-300">
          Σύνολικο Κόστος {booking?.totalAmount} €
        </span>
      </div>
      <div className="h-[20vh] w-full">
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
      </div>
    </section>
  );
};

export default EditChange;
