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
    <Table className="text-dark400_light700 mt-12 ">
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
          <TableHead className="flex items-center justify-center gap-1 px-2 text-center">
            Σκύλοι <IconArrowBigRightLineFilled size={20} />
          </TableHead>
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
            className="background-light800_dark300 text-dark100_light900  w-full"
          >
            <TableCell className="m-auto   max-h-[80px] max-w-[250px]  pl-12 text-base ">
              <Link href={`/editbooking/${booking?._id}`}>
                <IconEdit
                  size={23}
                  className="cursor-pointer hover:scale-105 dark:text-yellow-500"
                />
              </Link>
            </TableCell>
            <TableCell className="my-auto flex h-full  flex-col items-center  gap-8 pl-4 text-center text-base font-normal">
              <span>
                {" "}
                {formatDateToTime(new Date(booking.fromDate))}{" "}
                {formatDateString(booking.fromDate)}{" "}
              </span>
              <span>
                {" "}
                {formatDateToTime(new Date(booking.fromDate))}{" "}
                {formatDateString(booking.toDate)}
              </span>
            </TableCell>
            <TableCell className=" max-w-[500px] truncate pl-4  text-center text-base font-normal uppercase 2xl:max-w-[600px]">
              <Link
                href={`/clients/${booking?.client?.clientId}`}
                className="cursor-pointer hover:scale-105"
              >
                {booking?.client?.clientName}
              </Link>
            </TableCell>
            <TableCell className="mr-4 text-center text-base font-normal">
              {booking?.client?.phone}
            </TableCell>
            <TableCell className=" w-full   justify-center uppercase max-md:hidden">
              {booking?.dogs?.map((dog: any) => (
                <div key={dog._id} className="text-base">
                  {dog?.dogName}
                </div>
              ))}
            </TableCell>
            <TableCell className=" my-auto text-center text-lg font-normal">
              {booking?.dogs?.map((dog: any) => (
                <div key={dog._id} className=" ">
                  {dog?.roomName}
                </div>
              ))}
            </TableCell>
            <TableCell className=" flex h-full flex-col items-center pl-4 text-center text-base font-normal">
              {booking?.flag1 && (
                <div className="font-semibold uppercase dark:text-green-400">
                  Παραλαβη {booking?.client?.transportFee}€
                </div>
              )}
              {booking?.flag2 && (
                <div className="font-semibold uppercase dark:text-green-400">
                  Παραδοση {booking?.client?.transportFee}€
                </div>
              )}
              {!booking?.flag1 && !booking?.flag2 && (
                <span className="my-auto">ΟΧΙ</span>
              )}
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
