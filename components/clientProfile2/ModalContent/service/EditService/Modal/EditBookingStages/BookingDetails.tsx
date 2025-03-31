"use client";

import useEditBookingStore from "@/hooks/editBooking-store";
import { Avatar, cn } from "@heroui/react";
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
        "flex flex-col p-6 lg:w-[250px] lg:px-4 lg:pt-8 bg-dark-100 rounded-lg  h-full ",
        className
      )}
    >
      <Avatar
        className="mb-3 shadow-md"
        size="sm"
        src="https://i.pravatar.cc/150?u=a042581f4e29026704k"
      />
      <p className="text-lg font-medium text-default-500">
        {booking.client.clientName}
      </p>
      <p className="mb-2 text-lg font-semibold tracking-widest text-default-foreground">
        Κράτηση
      </p>
      <p className="mb-4 text-sm text-default-500">{booking.client.location}</p>

      <div className="mb-6 flex flex-col gap-3">
        {/* Dates & Times */}
        <div className="flex items-start gap-2">
          <Icon
            className="text-default-300"
            icon="solar:calendar-minimalistic-bold"
            width={20}
          />
          <div className="text-base font-medium text-default-600">
            <p>Άφιξη: {format(dateArrival, "dd/MM/yyyy HH:mm")}</p>
            <p>Αναχώρηση: {format(dateDeparture, "dd/MM/yyyy HH:mm")}</p>
          </div>
        </div>

        {/* Client Phone */}
        <div className="flex items-center gap-2">
          <Icon
            className="text-default-300"
            icon="solar:phone-bold"
            width={20}
          />
          <p className="text-base font-medium text-default-600">
            {booking.client.phone}
          </p>
        </div>

        {/* Booking Fee */}
        <div className="flex items-center gap-2">
          <Icon
            className="text-default-300"
            icon="solar:wallet-bold"
            width={20}
          />
          <p className="text-base font-medium text-default-600">
            Τέλος Κράτησης: €{booking?.client?.bookingFee?.toFixed(2)}
          </p>
        </div>

        {/* Transport Fee (optional) */}
        {booking.client.transportFee && booking.client.transportFee > 0 && (
          <div className="flex items-center gap-2">
            <Icon className="text-default-300" icon="mdi:car" width={20} />
            <p className="text-base font-medium text-default-600">
              Μεταφορικά: €{booking?.client?.transportFee?.toFixed(2)}
            </p>
          </div>
        )}

        {/* Extra Day */}
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
