"use client";
import React from "react";
import { Chip, Tooltip, Card, CardBody } from "@heroui/react";
import moment from "moment";

const renderServiceTypeChip = (service: any) => {
  const isStay = service.serviceType === "ΔΙΑΜΟΝΗ";
  const displayText = moment(service.date).format("DD/MM/YYYY");
  let tooltipContent: React.ReactNode = null;

  if (isStay && service.bookingId) {
    const booking = service.bookingId;

    tooltipContent = (
      <Card
        className="w-[40vw] max-w-[500px] rounded-lg p-4 font-sans"
        shadow="none"
      >
        <CardBody className="gap-2">
          {/* Dates */}
          <div className="flex items-center justify-between border-b border-divider py-1">
            <span className="text-base font-medium">Από:</span>
            <span className="text-base">
              {moment(booking.fromDate).format("DD/MM/YYYY/HH:mm")}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-divider pt-2">
            <span className="text-base font-medium">Έως:</span>
            <span className="text-base">
              {moment(booking.toDate).format("DD/MM/YYYY/HH:mm")}
            </span>
          </div>

          {/* Client Info */}
          <div className="flex items-center justify-between border-t border-divider pt-2">
            <span className="text-base font-medium">Πελάτης:</span>
            <span className="text-base">{booking.client?.clientName}</span>
          </div>
          <div className="flex items-center justify-between border-t border-divider pt-2">
            <span className="text-base font-medium">Ημερ. Χρέωση: </span>
            <span className="text-base">{booking.client?.bookingFee} € </span>
          </div>

          {/* Dogs */}
          <div className="flex flex-col gap-1 border-t border-divider pt-2">
            <span className="text-base font-medium">Κατοικίδια:</span>
            <ul className="list-inside list-disc text-base">
              {booking.dogs?.map((dog: any) => (
                <li key={dog.dogId}>
                  {dog.dogName} — {dog.roomName}
                </li>
              ))}
            </ul>
          </div>
        </CardBody>
      </Card>
    );
  }

  return isStay ? (
    <Tooltip
      content={tooltipContent}
      placement="top"
      delay={1}
      closeDelay={1}
      classNames={{ content: "p-0 font-sans tracking-widest" }}
    >
      <Chip
        variant="flat"
        size="sm"
        className="border-1 border-content2 font-sans text-base tracking-widest"
        classNames={{ content: "px-2" }}
      >
        {displayText}
      </Chip>
    </Tooltip>
  ) : (
    <Chip
      variant="flat"
      size="sm"
      className="border-1 border-content2 font-sans text-base tracking-widest"
      classNames={{ content: "px-2" }}
    >
      {service.serviceType.toLowerCase().includes("pettaxi")
        ? moment(service.date).format("DD/MM/YYYY, HH:mm")
        : displayText}
    </Chip>
  );
};

export default renderServiceTypeChip;
