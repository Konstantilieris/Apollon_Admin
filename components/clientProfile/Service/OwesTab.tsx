"use client";
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";

import { cn } from "@/lib/utils";
import { DropdownMenuAction } from "./OwesActionCommand";
import { IconSelector } from "@tabler/icons-react";

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
  const [oweServices, setOweServices] = React.useState<Service[]>(
    services.length ? services : []
  );
  const isServiceSelected = (serviceId: string) =>
    selectedServices.some(
      (selectedService) => selectedService._id === serviceId
    );
  const [sortOrder, setSortOrder] = useState<{ [key: string]: "asc" | "desc" }>(
    {
      date: "asc",
      name: "asc",
      remaining: "asc",
      amount: "asc",
    }
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
  const handleSort = (key: string) => {
    return () => {
      const newOrder = sortOrder[key] === "asc" ? "desc" : "asc";

      const sortedServices = [...oweServices].sort((a, b) => {
        let comparison = 0;

        if (key === "date") {
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (key === "name") {
          comparison = a.serviceType.localeCompare(b.serviceType);
        } else if (key === "remaining") {
          comparison = (a.remainingAmount ?? 0) - (b.remainingAmount ?? 0);
        } else if (key === "amount") {
          comparison = a.amount - b.amount;
        }

        // Reverse order if descending
        return newOrder === "asc" ? comparison : -comparison;
      });

      setOweServices(sortedServices);
      setSortOrder({ ...sortOrder, [key]: newOrder });
    };
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
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              <span className="flex items-center">
                Ημερομηνία
                <IconSelector
                  className="cursor-pointer"
                  onClick={handleSort("date")}
                />
              </span>
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              <span className="flex items-center">
                Υπηρεσία
                <IconSelector
                  className="cursor-pointer"
                  onClick={handleSort("name")}
                />
              </span>
            </TableHead>
            <TableHead className="pl-12 font-semibold text-light-900">
              Σημειώση
            </TableHead>

            <TableHead className="text-center font-semibold text-light-900">
              <span className="flex items-center">
                Οφειλόμενο
                <IconSelector
                  className="cursor-pointer"
                  onClick={handleSort("remaining")}
                />
              </span>
            </TableHead>
            <TableHead className="text-center font-semibold text-light-900">
              Eξοφλημένο
            </TableHead>
            <TableHead className=" font-semibold text-light-900">
              <span className=" flex items-center">
                Σύνολο
                <IconSelector
                  className="cursor-pointer"
                  onClick={handleSort("amount")}
                />
              </span>
            </TableHead>
            <TableHead className="flex h-full w-full justify-end px-2 py-3 pb-2 font-semibold text-light-900">
              <DropdownMenuAction selectedServices={selectedServices} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {oweServices.map((service: Service, index: number) => {
            let serviceType = service.serviceType;
            if (serviceType === "Pet Taxi (Drop-Off)") {
              serviceType = "Pet Taxi (ΠΑΡΑΔΟΣΗ)";
            } else if (serviceType === "Pet Taxi (Pick-Up)") {
              serviceType = "Pet Taxi (ΠΑΡΑΛΑΒΗ)";
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
                <TableCell className="pl-8">
                  {service.remainingAmount ?? "Ν/Α"} €
                </TableCell>
                <TableCell className="text-center">
                  {service.paidAmount ?? "Ν/Α"} €
                </TableCell>
                <TableCell className="pl-8">{service.amount} €</TableCell>
                <TableCell className=" mr-6 flex flex-row justify-end">
                  <Checkbox
                    id={`checkbox-${service._id}`}
                    checked={isServiceSelected(service._id)}
                    onCheckedChange={(checked: boolean | string) =>
                      handleCheckboxChange(service, checked === true)
                    }
                  />
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
