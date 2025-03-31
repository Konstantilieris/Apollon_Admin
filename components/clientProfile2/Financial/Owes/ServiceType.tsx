"use client";
import React from "react";
import { Chip, Tooltip, Card, CardBody } from "@heroui/react";
import moment from "moment";

const renderServiceTypeChip = (service: any) => {
  let displayText = "";
  let tooltipContent: React.ReactNode = "";

  if (service.serviceType === "ΔΙΑΜΟΝΗ") {
    // For "ΔΙΑΜΟΝΗ": show start date in chip; tooltip shows start and end dates.
    displayText = moment(service.date).format("DD/MM/YYYY");
    tooltipContent = (
      <Card className="w-72 p-0 font-sans" shadow="none">
        <CardBody className="gap-2">
          <div className="flex items-center justify-between border-b border-divider py-1">
            <span className="text-sm font-medium">Από:</span>
            <span className="text-sm">
              {moment(service.date).format("DD/MM/YYYY")}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-divider pt-2">
            <span className="text-sm font-medium">Έως:</span>
            <span className="text-sm">
              {moment(service.endDate).format("DD/MM/YYYY")}
            </span>
          </div>
        </CardBody>
      </Card>
    );
  } else if (service.serviceType.toLowerCase().includes("pettaxi")) {
    // For Pet Taxi: show date with time in chip, but no tooltip.
    displayText = moment(service.date).format("DD/MM/YYYY, HH:mm");
  } else {
    // Default: simply display the date.
    displayText = moment(service.date).format("DD/MM/YYYY");
  }

  // Only add tooltip for "ΔΙΑΜΟΝΗ".
  if (service.serviceType === "ΔΙΑΜΟΝΗ") {
    return (
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
          className="border-1 border-content2 font-sans tracking-widest"
          classNames={{ content: "px-2" }}
        >
          {displayText}
        </Chip>
      </Tooltip>
    );
  } else {
    // Render only the chip with no tooltip for all other service types.
    return (
      <Chip
        variant="flat"
        size="sm"
        className="border-1 border-content2 font-sans tracking-widest"
        classNames={{ content: "px-2" }}
      >
        {displayText}
      </Chip>
    );
  }
};

export default renderServiceTypeChip;
