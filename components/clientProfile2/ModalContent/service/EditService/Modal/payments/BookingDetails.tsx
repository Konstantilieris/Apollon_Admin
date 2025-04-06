import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Booking } from "@/types";

// A small helper to format dates nicely
function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}

interface BookingDetailsProps {
  booking: Booking;
}

export function BookingDetails({ booking }: BookingDetailsProps) {
  // If no booking, don’t render anything
  if (!booking) return null;

  const {
    _id,
    fromDate,
    toDate,
    extraDay,
    client,
    flag1,
    flag2,
    totalAmount,
    dogs = [],
  } = booking;
  // client object: { clientId, clientName, phone, location, transportFee, bookingFee }

  return (
    <Card>
      <CardHeader className="flex gap-3">
        <Icon icon="lucide:calendar" className="text-2xl text-default-500" />
        <div className="flex flex-col">
          <p className="text-base">Πληροφορίες Κράτησης</p>
          <p className="text-base text-default-500">ID: {_id}</p>
        </div>
      </CardHeader>
      <CardBody>
        {/* Basic booking info */}
        <div className="grid grid-cols-2 gap-4">
          {/* From/To dates */}
          <div>
            <p className="text-base text-default-500">Από</p>
            <p className="text-medium">{formatDate(fromDate)}</p>
          </div>
          <div>
            <p className="text-base text-default-500">Έως</p>
            <p className="text-medium">{formatDate(toDate)}</p>
          </div>

          {/* Location */}
          <div>
            <p className="text-base text-default-500">Τοποθεσία</p>
            <p className="text-medium">{client?.location ?? "-"}</p>
          </div>

          {/* Phone */}
          <div>
            <p className="text-base text-default-500">Τηλέφωνο</p>
            <p className="text-medium">{client?.phone ?? "-"}</p>
          </div>

          {/* Client name */}
          <div>
            <p className="text-base text-default-500">Πελάτης</p>
            <p className="text-medium">{client?.clientName ?? "-"}</p>
          </div>

          {/* Extra day */}
          <div>
            <p className="text-base text-default-500">Έξτρα Μέρα</p>
            <p className="text-medium">{extraDay ? "Ναι" : "Όχι"}</p>
          </div>

          {/* Pet Taxi Arrival (flag1) */}
          <div>
            <p className="text-base text-default-500">Pet Taxi Άφιξη</p>
            <p className="text-medium">{flag1 ? "Ναι" : "Όχι"}</p>
          </div>

          {/* Pet Taxi Departure (flag2) */}
          <div>
            <p className="text-base text-default-500">Pet Taxi Αναχώρηση</p>
            <p className="text-medium">{flag2 ? "Ναι" : "Όχι"}</p>
          </div>

          {/* Transport fee */}
          <div>
            <p className="text-base text-default-500">Μεταφορικά</p>
            <p className="text-medium">{client?.transportFee ?? 0} &euro;</p>
          </div>

          {/* Booking fee */}
          <div>
            <p className="text-base text-default-500">Έξοδα Κράτησης</p>
            <p className="text-medium">{client?.bookingFee ?? 0} &euro;</p>
          </div>

          {/* Total amount */}
          <div>
            <p className="text-base text-default-500">Συνολικό Ποσό</p>
            <p className="text-medium">{totalAmount ?? 0} &euro;</p>
          </div>
        </div>

        {/* Divider before dogs */}
        {dogs.length > 0 && <Divider className="my-5" />}

        {/* Dogs info */}
        {dogs.length > 0 && (
          <>
            <p className="mb-2 text-base text-default-500">Σκύλοι</p>
            <Table
              aria-label="Πληροφορίες σκύλων"
              removeWrapper
              classNames={{
                th: "text-base",
                td: "text-base",
              }}
            >
              <TableHeader>
                <TableColumn>Όνομα</TableColumn>
                <TableColumn>Δωμάτιο</TableColumn>
              </TableHeader>
              <TableBody>
                {dogs.map((dog: any) => (
                  <TableRow key={dog.id}>
                    <TableCell>{dog.dogName}</TableCell>
                    <TableCell>{dog.roomName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardBody>
    </Card>
  );
}
