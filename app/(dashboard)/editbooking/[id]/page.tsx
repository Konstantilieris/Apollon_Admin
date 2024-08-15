import ChangeDates from "@/components/editbooking/ChangeDates";
import UpdateTNT from "@/components/editbooking/ChangeTime";
import { Button } from "@/components/ui/button";


import { getBookingById } from "@/lib/actions/booking.action";
import { formatDate, formatTime } from "@/lib/utils";
import Image from "next/image";

import React from "react";

const EditChange = async ({ params }: any) => {
  const booking = JSON.parse(await getBookingById(params.id));

  return (
    <section className=" flex h-full w-full flex-col p-4 font-sans overflow-y-auto dark:bg-neutral-700">
      <div className="flex flex-row  w-full"><span className="font-sans font-semibold text-dark-100 dark:text-light-800 flex flex-row items-center gap-2 text-lg">
           <Image src={'/assets/icons/client.svg'} alt="client" width={30} height={30} className="invert dark:invert-0"/>  {booking?.client?.clientName}
          </span>
         </div>
         <div className="flex flex-col my-2">
      
      <div className=" flex  flex-row gap-4 text-md mt-2 bg-neutral-200 dark:bg-dark-100 rounded-lg px-4 py-5 w-full justify-between flex-wrap font-semibold">
        <span className="items-center dark:text-green-300 text-dark-100">
          
          {formatDate(new Date(booking.fromDate), "el")}-{" "}
          {formatDate(new Date(booking.toDate), "el")}
        </span>
        <span className="  dark:text-green-300 text-dark-100">
          {booking?.flag1 ? "Παραλαβη " : "Άφιξη  "}
          {formatTime(new Date(booking.fromDate), "el")} -
          {booking?.flag2 ? "Παράδοση " : "Αναχώρηση "}{" "}
          {formatTime(new Date(booking.toDate), "el")}
        </span>
        <span className=" dark:text-green-300 text-dark-100">
          Σύνολικο Κόστος {booking?.totalAmount} €
        </span>
      </div></div>

      <div className="min-2xl:h-[30vh] 2xl:h-[20vh] w-full mb-4">
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
      <UpdateTNT transportFee={booking.client.transportFee} initialDate={booking.fromDate} type="flag1" hasTransport={booking.flag1} />
      <UpdateTNT transportFee={booking.client.transportFee} initialDate={booking.toDate} type="flag2" hasTransport={booking.flag2} />
      <button className="px-3 py-1 rounded-full bg-red-600 font-bold text-white tracking-widest transform hover:scale-105 hover:bg-red-700 transition-colors duration-200 self-end mr-10 mt-4">
            Διαγραφή
          </button>
    </section>
  );
};

export default EditChange;
