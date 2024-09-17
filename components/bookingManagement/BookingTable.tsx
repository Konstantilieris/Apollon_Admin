import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconArrowBigRightLineFilled, IconEdit } from "@tabler/icons-react";
import { formatDateString, formatDateToTime } from "@/lib/utils";
import Link from "next/link";
const BookingTable = ({ bookings }: { bookings: any }) => {
  return (
    <Table className="text-dark400_light700 mt-12 w-full">
      <TableHeader className="border-b-4 border-light-700 bg-white text-base font-semibold text-black dark:border-dark-400 dark:bg-slate-700 dark:text-light-700 xl:text-lg">
        <TableRow className="h-14">
          <TableHead className="px-4 text-center max-md:hidden">
            Επεξεργασία
          </TableHead>
          <TableHead className="px-4 text-center max-md:hidden">
            Ημερομηνία
          </TableHead>
          <TableHead className="px-4 text-center">Ονοματεπώνυμο</TableHead>
          <TableHead className="px-4 text-center">Τηλέφωνο</TableHead>
          <TableHead className="flex items-center justify-center gap-1 px-4 text-center">
            Σκύλοι <IconArrowBigRightLineFilled size={20} />
          </TableHead>
          <TableHead className="px-4 text-center">Δωμάτιο</TableHead>
          <TableHead className="px-4 text-center max-md:hidden">
            Μεταφορά
          </TableHead>
          <TableHead className="px-4 text-center max-md:hidden">
            Συνολικό Κόστος
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {bookings?.map((booking: any) => (
          <TableRow
            key={booking?._id}
            className="bg-light-500 text-dark-700 transition-all duration-200 hover:bg-light-700 dark:bg-dark-500 dark:text-light-700 dark:hover:bg-dark-200"
          >
            <TableCell className="p-4 text-center">
              <Link href={`/editbooking/${booking?._id}`}>
                <IconEdit
                  size={23}
                  className="cursor-pointer hover:scale-105 dark:text-yellow-500"
                />
              </Link>
            </TableCell>

            <TableCell className="p-4 text-center max-md:hidden">
              <div>
                {formatDateToTime(new Date(booking.fromDate))}{" "}
                {formatDateString(booking.fromDate)}
              </div>
              <div>
                {formatDateToTime(new Date(booking.toDate))}{" "}
                {formatDateString(booking.toDate)}
              </div>
            </TableCell>

            <TableCell className="truncate p-4 text-center text-base font-normal uppercase">
              <Link
                href={`/clients/${booking?.client?.clientId}`}
                className="hover:underline"
              >
                {booking?.client?.clientName}
              </Link>
            </TableCell>

            <TableCell className="p-4 text-center text-base font-normal">
              {booking?.client?.phone}
            </TableCell>

            <TableCell className="p-4 text-center text-base font-normal max-md:hidden">
              {booking?.dogs?.map((dog: any) => (
                <div key={dog._id} className="">
                  {dog?.dogName}
                </div>
              ))}
            </TableCell>

            <TableCell className="p-4 text-center text-base font-normal">
              {booking?.dogs?.map((dog: any) => (
                <div key={dog._id}>{dog?.roomName || "N/A"}</div>
              ))}
            </TableCell>

            <TableCell className="p-4 text-center text-base font-normal">
              {booking?.flag1 && (
                <div className="font-semibold uppercase text-green-500 dark:text-green-400">
                  Παραλαβή {booking?.client?.transportFee}€
                </div>
              )}
              {booking?.flag2 && (
                <div className="font-semibold uppercase text-green-500 dark:text-green-400">
                  Παράδοση {booking?.client?.transportFee}€
                </div>
              )}
              {!booking?.flag1 && !booking?.flag2 && <span>ΟΧΙ</span>}
            </TableCell>

            <TableCell className="p-4 text-center text-base font-normal">
              {booking?.totalAmount} €
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BookingTable;
