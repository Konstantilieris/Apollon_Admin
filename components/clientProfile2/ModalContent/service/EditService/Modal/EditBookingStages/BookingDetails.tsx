"use client";

import useEditBookingStore from "@/hooks/editBooking-store";
import { Avatar, cn, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { format } from "date-fns";

interface BookingDetailsProps {
  className?: string;
}

export default function BookingDetails({ className }: BookingDetailsProps) {
  const {
    booking,
    dateArrival,
    dateDeparture,
    extraDay,
    taxiArrival,
    taxiDeparture,
  } = useEditBookingStore();

  if (!booking || !dateArrival || !dateDeparture) {
    return <div>No booking details available.</div>;
  }

  return (
    <div
      className={cn(
        "flex flex-col p-6 lg:w-[350px] lg:px-4 lg:pt-8 bg-dark-100 rounded-lg h-full space-y-4 ",
        className
      )}
    >
      <div className="space-y-2">
        <Avatar
          className="mb-3 shadow-md"
          size="sm"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704k"
        />
        <p className="text-lg font-medium text-default-500">
          {booking.client.clientName}
        </p>
        <p className="pl-2 text-base font-medium uppercase text-default-500">
          {booking.dogs.map((dog) => dog?.dogName).join(", ")}
        </p>
        <p className=" pl-2 text-sm tracking-wide text-default-500">
          {booking.client.location}
        </p>

        <p className="mb-4 pl-2 text-base font-medium text-default-500">
          {booking.client.phone}
        </p>
        <Divider className="w-full" />
      </div>

      <div className="mb-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Icon
            className="text-default-300"
            icon="solar:wallet-bold"
            width={20}
          />
          <p className="text-base font-medium text-default-600">
            Ημερήσια Χρέωση: €{booking?.client?.bookingFee?.toFixed(2)}
          </p>
        </div>

        {/* Transport Fee (optional) */}
        {booking.client.transportFee && booking.client.transportFee > 0 && (
          <div className="flex items-center gap-2">
            <Icon className="text-default-300" icon="mdi:car" width={20} />
            <p className="text-base font-medium text-default-600">
              Χρέωση Μεταφοράς: €{booking?.client?.transportFee?.toFixed(2)}
            </p>
          </div>
        )}
        <Divider className="w-full" />
        {/* Dates & Times */}
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <Icon
              className="text-default-300"
              icon="solar:calendar-minimalistic-bold"
              width={20}
            />
            <p>Άφιξη: {format(dateArrival, "dd/MM/yyyy HH:mm")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Icon
              className="text-default-300"
              icon="solar:calendar-minimalistic-bold"
              width={20}
            />{" "}
            <p>Αναχώρηση: {format(dateDeparture, "dd/MM/yyyy HH:mm")}</p>
          </div>
        </div>
        <Divider className="w-full" />

        {extraDay && (
          <div className="flex items-center gap-2">
            <Icon
              className="text-purple-400"
              icon="solar:clock-circle-bold"
              width={20}
            />
            <p className="text-base font-medium text-default-600">
              Επιπλέον Ημέρα
            </p>
          </div>
        )}

        {/* Pet Taxi (Arrival) */}
        {taxiArrival && (
          <div className="flex items-center gap-2">
            <Icon className="text-lime-400" icon="mdi:taxi" width={20} />
            <p className="text-base font-medium text-default-600">
              Pet Taxi (Άφιξη)
            </p>
          </div>
        )}

        {/* Pet Taxi (Departure) */}
        {taxiDeparture && (
          <div className="flex items-center gap-2">
            <Icon className="text-lime-400" icon="mdi:taxi" width={20} />
            <p className="text-base font-medium text-default-600">
              Pet Taxi (Αναχώρηση)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
