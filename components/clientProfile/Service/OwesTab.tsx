"use client";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";

import { cn, stringToHexColor } from "@/lib/utils";
import { DropdownMenuAction } from "./OwesActionCommand";

export interface Service {
  serviceType: string;
  clientId: string;
  amount: number;
  notes?: string;
  bookingId?: string;
  date: Date;
  paid: boolean;
  paymentDate?: Date;
  _id: string; // Assuming you have a unique ID for each service
}

export interface UnpaidServicesTableProps {
  services: Service[];
}

const OwesTab = ({ services }: UnpaidServicesTableProps) => {
  // State to store selected services (entire service object)
  const [selectedServices, setSelectedServices] = React.useState<Service[]>([]);

  // Check if a service is selected by comparing its ID
  const isServiceSelected = (serviceId: string) =>
    selectedServices.some(
      (selectedService) => selectedService._id === serviceId
    );

  // Handle checkbox changes
  const handleCheckboxChange = (service: Service, isChecked: boolean) => {
    if (isChecked) {
      // Add the entire service object to selectedServices array
      setSelectedServices((prevSelected) => [...prevSelected, service]);
    } else {
      // Remove the service from the selectedServices array based on its ID
      setSelectedServices((prevSelected) =>
        prevSelected.filter(
          (selectedService) => selectedService._id !== service._id
        )
      );
    }
  };

  return (
    <div className=" ml-8 min-h-[70vh] overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className=" bg-dark-400  text-left">
            <TableHead className="px-2 py-3 font-semibold text-light-900">
              <DropdownMenuAction selectedServices={selectedServices} />
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Υπηρεσία
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Σύνολο
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Σημειώση
            </TableHead>
            <TableHead className="px-4 py-3 pl-20 font-semibold text-light-900">
              Booking ID
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Ημερομηνία
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service: Service, index: number) => {
            let color;
            let serviceType = service.serviceType;
            if (serviceType === "Pet Taxi (Drop-Off)") {
              serviceType = "Pet Taxi (ΠΑΡΑΔΟΣΗ)";
            } else if (serviceType === "Pet Taxi (Pick-Up)") {
              serviceType = "Pet Taxi (ΠΑΡΑΛΑΒΗ)";
            }

            if (service.bookingId) {
              color = stringToHexColor(service.bookingId);
            }

            return (
              <TableRow
                key={index}
                className={cn(
                  "border-b border-gray-200 hover:bg-dark-200 bg-dark-300",
                  {
                    "bg-dark-200 hover:bg-dark-100":
                      service.serviceType === "ΔΙΑΜΟΝΗ",
                  }
                )}
              >
                {/* Actions column */}
                <TableCell className="mx-auto ml-4 flex flex-row justify-items-end">
                  <Checkbox
                    id={`checkbox-${service._id}`}
                    checked={isServiceSelected(service._id)}
                    onCheckedChange={(checked: boolean | string) =>
                      handleCheckboxChange(service, checked === true)
                    }
                  />
                </TableCell>
                {/* Other columns */}
                <TableCell className="px-4 py-3">{serviceType}</TableCell>

                <TableCell className="py-3 pl-7">{service.amount}</TableCell>
                <TableCell className="max-w-[7vw] truncate px-4 py-3 pl-8">
                  {service.notes || "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3" style={{ color }}>
                  {service.bookingId}
                </TableCell>
                <TableCell className="px-4 py-3">
                  {new Date(service.date).toLocaleDateString("el-GR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default OwesTab;
