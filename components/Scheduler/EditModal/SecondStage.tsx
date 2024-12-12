"use client";

import { IBooking } from "@/database/models/booking.model";
import { IEvent } from "@/database/models/event.model";
import { checkBookingRoomRangeDateAvailability } from "@/lib/actions/booking.action";
import { IconUser } from "@tabler/icons-react";
import React from "react";

import ButtonModal from "./buttonModal";
import { Checkbox } from "@/components/ui/checkbox";
import TimeSelect from "@/components/clientProfile/Book/RoomResults/TabRoomViews/TimeSelector";
import { BookingDatePicker } from "@/components/datepicker/BookingDatePicker";
import useEditBookingStore from "@/hooks/editBooking-store";
import ToggleWrapper from "@/components/clientProfile/Book/RoomResults/TransportToggle";

interface props {
  event: IEvent;

  setStage: any;
  stage: number;
  booking: IBooking;
}
const SecondStage = ({
  event,

  setStage,

  booking,
}: props) => {
  const {
    dateArrival,
    setDateArrival,
    dateDeparture,
    setDateDeparture,
    taxiArrival,
    taxiDeparture,
    setTaxiArrival,
    setTaxiDeparture,
    extraDay,
    setExtraDay,
  } = useEditBookingStore();
  const handleStage1 = async () => {
    if (!dateArrival || !dateDeparture || !booking) return;

    const roomAvailability = await checkBookingRoomRangeDateAvailability({
      rangeDate: { from: dateArrival, to: dateDeparture },
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
            {booking?.client?.clientName}
          </span>
        </h1>
        <IconUser size={32} className="text-yellow-500 " />
      </div>
      <div className="mt-12 flex h-full w-full flex-col items-center justify-center  gap-6 space-y-4">
        <div className="flex  flex-row items-center gap-4">
          <BookingDatePicker
            useHook={useEditBookingStore}
            className=" place-content-center"
          />
          <div className="flex items-center gap-2">
            <Checkbox
              id="terms"
              className="h-6 w-6"
              checked={extraDay}
              onCheckedChange={(value: boolean) => setExtraDay(value)}
            />
            <label
              htmlFor="terms"
              className="font-sans text-lg  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Χρέωση 24ωρη
            </label>
          </div>
        </div>

        <div className="flex flex-row">
          <TimeSelect
            date={dateArrival}
            setDate={setDateArrival}
            placeHolderText={"Ώρα Άφιξης"}
            className="w-[325px]"
          />
          <ToggleWrapper
            taxi={taxiArrival}
            setTaxi={setTaxiArrival}
            label={{
              on: "Παραλαβή",
              off: "Άφιξη",
            }}
          />
        </div>
        <div className="flex flex-row">
          <TimeSelect
            date={dateDeparture}
            setDate={setDateDeparture}
            placeHolderText={"Ώρα Αναχώρησης "}
            className="w-[325px]"
          />
          <ToggleWrapper
            taxi={taxiDeparture}
            setTaxi={setTaxiDeparture}
            label={{
              on: "Παράδοση",
              off: "Αναχώρηση",
            }}
          />
        </div>
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
          disabled={!dateArrival || !dateDeparture}
        />
      </div>
    </div>
  );
};

export default SecondStage;
