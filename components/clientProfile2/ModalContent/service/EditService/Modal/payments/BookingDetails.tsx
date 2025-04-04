import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Booking } from "@/types";

interface BookingDetailsProps {
  booking: Booking;
}

export function BookingDetails({ booking }: BookingDetailsProps) {
  return (
    <Card>
      <CardHeader className="flex gap-3">
        <Icon icon="lucide:calendar" className="text-2xl text-default-500" />
        <div className="flex flex-col">
          <p className="text-base">Πληροφορίες Κράτησης</p>
          <p className="text-small text-default-500">ID: {booking._id}</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-small text-default-500">Από</p>
            <p className="text-medium">/ΗΕΥ</p>
          </div>
          <div>
            <p className="text-small text-default-500">Έως</p>
            <p className="text-medium">ΗΕΥ</p>
          </div>
          <div className="col-span-2">
            <p className="text-small text-default-500">Τοποθεσία</p>
            <p className="text-medium">{booking.client.location}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
