"use client";

import React, { memo } from "react";
import {
  IconFileReport,
  IconClockHour2Filled,
  IconChartInfographic,
  IconBedFilled,
} from "@tabler/icons-react";
import { CardWrapperClientRow } from "../../../Layout/CardClientRow";
import {
  getAverageBookingsPerMonth,
  getAverageStay,
  getBookingLength,
  getLastBooking,
} from "@/lib/actions/client.action";

// If you're using Next.js 13+ Server Components, remove "use client"
// or move this logic to a server component directly.
// For a pure server component, the "memo" is generally not needed.

const ClientStatsRow = async ({ client }: { client: any }) => {
  const [bookingLength, avgTime, avgBookings, lastBooking] = await Promise.all([
    getBookingLength(client._id),
    getAverageStay(client._id),
    getAverageBookingsPerMonth(client._id),
    getLastBooking(client._id),
  ]);

  // Build an array of stats objects. Each object (if truthy) will be rendered.
  const stats = [
    bookingLength && {
      icon: IconFileReport,
      value: bookingLength.toString(),
      description: "Αριθμός Κρατήσεων",
    },
    avgTime && {
      icon: IconClockHour2Filled,
      value: avgTime.toFixed(2).toString(),
      description: "Μέση Διάρκεια",
    },
    avgBookings && {
      icon: IconChartInfographic,
      value: avgBookings.toFixed(2).toString(),
      description: "Μέσες Κρατήσεις/Μήνα",
    },
    lastBooking && {
      icon: IconBedFilled,
      value: lastBooking.totalAmount.toString(),
      description: "Τελευταία Κράτηση",
      hasEuro: true,
    },
  ].filter(Boolean);

  return (
    <div className="flex h-full w-full items-end justify-end gap-8 p-1">
      {stats.map((item, idx) => (
        <CardWrapperClientRow key={idx} item={item} hasEuro={item.hasEuro} />
      ))}
    </div>
  );
};

export default memo(ClientStatsRow, (prevProps, nextProps) => {
  return prevProps.client._id === nextProps.client._id;
});
