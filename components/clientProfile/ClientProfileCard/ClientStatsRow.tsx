import React, { memo } from "react";

import {
  IconFileReport,
  IconClockHour2Filled,
  IconChartInfographic,
  IconBedFilled,
} from "@tabler/icons-react";
import { CardWrapperClientRow } from "../Layout/CardClientRow";
import {
  getAverageBookingsPerMonth,
  getAverageStay,
  getBookingLength,
  getLastBooking,
} from "@/lib/actions/client.action";

const ClientStatsRow = async ({ client }: any) => {
  const [bookingLength, avgTime, avgBookings, lastBooking] = await Promise.all([
    getBookingLength(client._id),
    getAverageStay(client._id),
    getAverageBookingsPerMonth(client._id),
    getLastBooking(client._id),
  ]);

  return (
    <div className=" flex h-full w-full items-end  justify-end gap-8 p-1">
      {bookingLength ? (
        <CardWrapperClientRow
          item={{
            icon: IconFileReport,
            value: bookingLength.toString(),
            description: "Αριθμός Κρατήσεων",
          }}
        />
      ) : null}

      {avgTime ? (
        <CardWrapperClientRow
          item={{
            icon: IconClockHour2Filled,
            value: avgTime.toFixed(2).toString(),
            description: "Μέση Διάρκεια",
          }}
        />
      ) : null}
      {avgBookings ? (
        <CardWrapperClientRow
          item={{
            icon: IconChartInfographic,
            value: avgBookings.toString(),
            description: "Μέσες Κρατήσεις/Μήνα",
          }}
        />
      ) : null}

      {lastBooking ? (
        <CardWrapperClientRow
          item={{
            icon: IconBedFilled,
            value: lastBooking.totalAmount.toString(),
            description: "Τελευταία Κράτηση",
          }}
          hasEuro={true}
        />
      ) : null}
    </div>
  );
};

export default memo(ClientStatsRow, (prevProps, nextProps) => {
  return prevProps.client._id === nextProps.client._id;
});
