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
  remainingAmount?: number;
  paidAmount?: number;
  _id: string; // Assuming you have a unique ID for each service
}

export interface UnpaidServicesTableProps {
  services: Service[];
}

const OwesTab = ({ services }: UnpaidServicesTableProps) => {
  // State to store selected services (entire service object)
  const [selectedServices, setSelectedServices] = React.useState<Service[]>([]);
  const [totalSelectedAmount, setTotalSelectedAmount] = React.useState(0);
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
      setTotalSelectedAmount((prevAmount) => prevAmount + service.amount);
    } else {
      // Remove the service from the selectedServices array based on its ID
      setSelectedServices((prevSelected) =>
        prevSelected.filter(
          (selectedService) => selectedService._id !== service._id
        )
      );
      setTotalSelectedAmount((prevAmount) => prevAmount - service.amount);
    }
  };

  return (
    <div className=" ml-8 min-h-[70vh] overflow-x-auto">
      <div className="mb-1 flex w-full flex-row text-lg">
        <p className="font-medium ">
          Σύνολο:{" "}
          <span className="text-blue-500"> {totalSelectedAmount} €</span>{" "}
        </p>
      </div>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className=" bg-dark-400  text-left">
            <TableHead className="px-2 py-3 font-semibold text-light-900">
              <DropdownMenuAction selectedServices={selectedServices} />
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Ημερομηνία
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Υπηρεσία
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Σημειώση
            </TableHead>

            <TableHead className="text-center font-semibold text-light-900">
              Οφειλόμενο
            </TableHead>
            <TableHead className="text-center font-semibold text-light-900">
              Eξοφλημένο
            </TableHead>
            <TableHead className="text-center font-semibold text-light-900">
              Σύνολο
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
                <TableCell className="px-4 py-3">
                  {new Date(service.date).toLocaleDateString("el-GR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell
                  className={cn("px-4 py-3 font-medium", {
                    "text-blue-500": isServiceSelected(service._id),
                  })}
                >
                  {serviceType}
                </TableCell>

                <TableCell className="max-w-[7vw] truncate px-4 py-3 pl-8">
                  {service.notes || "N/A"}
                </TableCell>
                <TableCell className="text-center" style={{ color }}>
                  {service.remainingAmount ?? "Ν/Α"} €
                </TableCell>
                <TableCell className="text-center">
                  {service.paidAmount ?? "Ν/Α"} €
                </TableCell>
                <TableCell className="text-center">
                  {service.amount} €
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <span className="ml-4 text-sm text-gray-400">
        {selectedServices.length} από {services.length} επιλεγμένες υπηρεσίες
      </span>
    </div>
  );
};

export default OwesTab;
