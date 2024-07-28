import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateString } from "@/lib/utils";
import Link from "next/link";
const BookingTable = ({ bookings }: { bookings: any }) => {
  return (
    <Table className="text-dark400_light700 mt-12 font-sans">
      <TableHeader className="border-b-8 border-light-700 bg-white text-base font-semibold text-black dark:border-dark-400 dark:bg-slate-700 dark:text-light-700 xl:text-lg">
        <TableRow>
          <TableHead className="ml-2 text-center max-md:hidden">
            Επεξεργασία
          </TableHead>
          <TableHead className="ml-2 text-center max-md:hidden">
            Ημερομηνία
          </TableHead>
          <TableHead className="text-center">Ονοματεπώνυμο</TableHead>
          <TableHead className="text-center">Τηλέφωνο</TableHead>
          <TableHead className="px-2 text-center">Σκύλοι</TableHead>
          <TableHead className="px-2 text-center">Δωμάτιο</TableHead>
          <TableHead className="px-2 text-center">Μεταφορά</TableHead>
          <TableHead className="px-2 text-center max-md:hidden">
            Συνολικό Κόστος
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="mt-2">
        {bookings?.map((booking: any) => (
          <TableRow
            key={booking?._id}
            className="background-light800_dark300 text-dark100_light900 font-sans"
          >
            <TableCell className="max-w-[250px] pl-8 pr-10 text-center text-base font-normal">
              <Link href={`/editbooking/${booking?._id}`}>
                <span className="cursor-pointer hover:scale-105"> ...</span>
              </Link>
            </TableCell>
            <TableCell className="max-w-[250px] pl-4 pr-10 text-center text-base font-normal">
              {formatDateString(booking.fromDate)}-{" "}
              {formatDateString(booking.toDate)}
            </TableCell>
            <TableCell className="ml-4 flex max-w-[500px] justify-center truncate pr-10 text-center text-base font-normal 2xl:max-w-[600px]">
              <Link
                href={`/clients/${booking?.client?.clientId}`}
                className="cursor-help hover:scale-105"
              >
                {booking?.client?.clientName}
              </Link>
            </TableCell>
            <TableCell className="mr-4 text-center text-base font-normal">
              {booking?.client?.phone}
            </TableCell>
            <TableCell className="flex w-full max-w-[250px] items-center justify-center max-md:hidden">
              {booking?.dogs?.map((dog: any) => (
                <span
                  key={dog._id}
                  className="flex-center h-fit rounded-full p-4 text-base"
                >
                  {dog?.dogName}
                </span>
              ))}
            </TableCell>
            <TableCell className="text-center text-base font-normal">
              {booking?.dogs?.map((dog: any) => (
                <span key={dog._id} className="flex-center h-fit p-4 text-base">
                  {dog?.roomName}
                </span>
              ))}
            </TableCell>
            <TableCell className="flex flex-col items-center pl-4 text-center text-base font-normal">
              {booking?.flag1 && (
                <span className="text-sm text-green-500">
                  Παραλαβή {booking?.client?.transportFee}€
                </span>
              )}
              {booking?.flag2 && (
                <span className="text-indigo-500">
                  Παράδοση {booking?.client?.transportFee}€
                </span>
              )}
              {!booking?.flag1 && !booking?.flag2 && "ΟΧΙ"}
            </TableCell>
            <TableCell className="pl-4 pr-10 text-center text-base font-normal">
              {booking?.totalAmount} €
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BookingTable;
