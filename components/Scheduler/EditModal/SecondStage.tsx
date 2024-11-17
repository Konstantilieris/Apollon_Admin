"use client";
import { BookingDatePicker } from "@/components/datepicker/BookingDatePicker";
import { IBooking } from "@/database/models/booking.model";
import { IEvent } from "@/database/models/event.model";
import { checkBookingRoomRangeDateAvailability } from "@/lib/actions/booking.action";
import { IconCalendarEvent, IconUser } from "@tabler/icons-react";
import React from "react";
import { DateRange } from "react-day-picker";
import ButtonModal from "./buttonModal";
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
        <ButtonModal
          gradientColor="via-yellow-500"
          containerStyle=" self-end"
          onClick={() => setStage(0)}
          title="ΕΠΙΣΤΡΟΦΗ"
        />
        <ButtonModal
          title="ΣΥΝΕΧΕΙΑ"
          containerStyle=" self-end"
          gradientColor="via-yellow-500"
          onClick={handleStage1}
          disabled={!rangeDate?.from || !rangeDate?.to}
        />
      </div>
    </div>
  );
};

export default SecondStage;
