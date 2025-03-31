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
import { DropdownMenuAction } from "../ActionServices/OwesActionCommand";
import { IconSelector } from "@tabler/icons-react";
import moment from "moment";

export interface Service {
  serviceType: string;
  clientId: string;
  amount: number;
  notes?: string;
  endDate: Date;
  bookingId?: string;
  date: Date;
  paid: boolean;
  paymentDate?: Date;
  remainingAmount?: number;
  taxRate?: number;
  taxAmount?: number;
  discount?: number;
  paidAmount?: number;
  totalAmount?: number;
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
  const totalDebt = services.reduce(
    (acc: any, service: any) => acc + service.remainingAmount,
    0
  );
  const totalAmount = services.reduce(
    (acc: any, service: any) => acc + service.amount,
    0
  );
  const totalPayments = services.reduce(
    (acc: any, service: any) => acc + service.paidAmount,
    0
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
          <TableRow className=" bg-neutral-900  text-left">
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
              <span className="flex items-center">Διάρκεια</span>
            </TableHead>

            <TableHead className="px-4 py-3 font-semibold text-light-900">
              <span className="flex items-center">
                Τύπος
                <IconSelector
                  className="cursor-pointer"
                  onClick={handleSort("name")}
                />
              </span>
            </TableHead>
            <TableHead className="pl-12 font-semibold text-light-900">
              Σημειώση
            </TableHead>
            <TableHead className=" font-semibold text-light-900">
              <span className=" flex w-full items-center justify-center">
                Αρχικό Σύνολο
                <IconSelector
                  className="cursor-pointer"
                  onClick={handleSort("amount")}
                />
                <span className="ml-2 rounded-lg border border-light-900 bg-neutral-900 p-2 text-base text-light-900">
                  {totalAmount.toFixed(2)} €
                </span>
              </span>
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Φόρος (%)
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Φόρος (€)
            </TableHead>
            <TableHead className=" font-semibold text-light-900">
              <span className=" flex w-full items-center justify-center">
                Τελικό Σύνολο
                <IconSelector
                  className="cursor-pointer"
                  onClick={handleSort("amount")}
                />
                <span className="ml-2 rounded-lg border border-light-900 bg-neutral-900 p-2 text-base text-light-900">
                  {totalAmount.toFixed(2)} €
                </span>
              </span>
            </TableHead>

            <TableHead className="text-center font-semibold text-light-900">
              Έξοφλημένο
              <span className="ml-2 rounded-lg border border-green-500 bg-neutral-900 p-2 text-base text-light-900">
                {totalPayments.toFixed(2)} €
              </span>
            </TableHead>
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Έκπτωση
            </TableHead>
            <TableHead className="text-center font-semibold text-light-900">
              <span className="flex items-center">
                Οφειλόμενο
                <IconSelector
                  className="cursor-pointer"
                  onClick={handleSort("remaining")}
                />
                <span className=" ml-2 rounded-lg border border-red-500 bg-dark-100 p-2 text-base text-light-900">
                  {totalDebt.toFixed(2)} €
                </span>
              </span>
            </TableHead>

            <TableHead className="flex h-full w-full justify-end px-2 py-3 pb-2 font-semibold text-light-900">
              <DropdownMenuAction selectedServices={selectedServices} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {oweServices.map((service: Service, index: number) => {
            const start = moment(service.date);
            const end = moment(service.endDate);
            let serviceType = service.serviceType;
            if (serviceType === "Pet Taxi (Drop-Off)") {
              serviceType = "Pet Taxi (ΠΑΡΑΔΟΣΗ)";
            } else if (serviceType === "Pet Taxi (Pick-Up)") {
              serviceType = "Pet Taxi (ΠΑΡΑΛΑΒΗ)";
            }

            return (
              <TableRow
                key={service._id + index}
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
                  -{" "}
                  {new Date(service.endDate).toLocaleDateString("el-GR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="px-4 py-3">
                  {end.diff(start, "days")} ημέρες
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
                <TableCell className="pl-8 text-center">
                  {service.amount} €
                </TableCell>
                <TableCell className="pl-8 text-start">
                  {service.taxRate ?? "N/A"} %
                </TableCell>
                <TableCell className="pl-8 text-start">
                  {service.taxAmount ?? "Ν/Α"} €
                </TableCell>
                <TableCell className="text-center">
                  {service.totalAmount ?? "Ν/Α"} €
                </TableCell>
                <TableCell className="text-center">
                  {service.paidAmount ?? "Ν/Α"} €
                </TableCell>
                <TableCell className="pl-11">
                  {service.discount ?? 0} €
                </TableCell>

                <TableCell className="pl-12">
                  {service?.remainingAmount?.toFixed(2) ?? "Ν/Α"} €
                </TableCell>

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
