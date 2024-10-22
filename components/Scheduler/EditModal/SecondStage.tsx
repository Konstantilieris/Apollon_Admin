"use client";
import { BookingDatePicker } from "@/components/datepicker/BookingDatePicker";
import { IBooking } from "@/database/models/booking.model";
import { IEvent } from "@/database/models/event.model";
import { checkBookingRoomRangeDateAvailability } from "@/lib/actions/booking.action";
import {
  IconArrowLeft,
  IconCalendarEvent,
  IconUser,
} from "@tabler/icons-react";
import React from "react";
import { DateRange } from "react-day-picker";
interface props {
  event: IEvent;
  rangeDate: DateRange | undefined;
  setRangeDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  setIsTransport1: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTransport2: React.Dispatch<React.SetStateAction<boolean>>;
  isTransport1: boolean;
  isTransport2: boolean;
  setStage: any;
  stage: number;
  booking: IBooking;
}
const SecondStage = ({
  event,
  rangeDate,
  setRangeDate,
  setIsTransport1,
  setIsTransport2,
  setStage,
  isTransport1,
  isTransport2,

  booking,
}: props) => {
  const handleStage1 = async () => {
    if (!rangeDate?.from || !rangeDate?.to || !booking) return;
    const roomAvailability = await checkBookingRoomRangeDateAvailability({
      rangeDate,
      bookingId: JSON.parse(JSON.stringify(event.Id)),
    });
    if (roomAvailability) {
      setStage(2);
    } else {
      setStage(3);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col gap-4 rounded-lg bg-white p-6 shadow-md dark:bg-neutral-800">
      {/* Booking Header */}
      <div className="flex items-center justify-center border-b border-gray-300 p-4 dark:border-neutral-700">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Επεξεργασία Κράτησης:{" "}
          <span className="font-bold text-yellow-500 ">
            {booking?.client.clientName}
          </span>
        </h1>
        <IconUser size={32} className="text-yellow-500 " />
      </div>
      <div className="mt-20 flex h-full flex-col items-center justify-between  gap-6 ">
        <div className="flex items-center gap-4">
          <IconCalendarEvent size={28} className="text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Επιλογή Νέας Ημερομηνίας
          </h2>
        </div>
        <BookingDatePicker
          date={rangeDate}
          setDate={setRangeDate}
          taxiArrival={isTransport1}
          setTaxiArrival={setIsTransport1}
          taxiDeparture={isTransport2}
          setTaxiDeparture={setIsTransport2}
        />
      </div>
      <div className="my-auto mt-4 flex h-full justify-center gap-4">
        <button
          onClick={() => setStage(0)}
          className="group relative  z-50 self-end border border-black bg-transparent px-8 py-2 text-black transition duration-200 dark:border-white"
        >
          <div className="absolute -bottom-2 -right-2 -z-10 h-full w-full bg-pink-700 transition-all duration-200 group-hover:bottom-0 group-hover:right-0" />
          <span className="relative flex flex-row items-center text-xl">
            <IconArrowLeft size={20} />
            Επιστροφή
          </span>
        </button>

        <button
          onClick={handleStage1}
          disabled={!rangeDate?.from || !rangeDate?.to}
          className="group relative  z-50 self-end border border-black bg-transparent px-8 py-2 text-black transition duration-200 dark:border-white"
        >
          <div className="absolute -bottom-2 -right-2 -z-10 h-full w-full bg-yellow-400 transition-all duration-200 group-hover:bottom-0 group-hover:right-0" />
          <span className="relative text-xl">ΣΥΝΕΧΕΙΑ</span>
        </button>
      </div>
    </div>
  );
};

export default SecondStage;
