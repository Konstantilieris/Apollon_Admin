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

import { DropdownMenuAction } from "./OwesActionCommand";
import { cn, stringToHexColor } from "@/lib/utils";

export interface Service {
  serviceType: string;
  clientId: string;
  amount: number;
  notes?: string;
  bookingId?: string;
  date: Date;
  paid: boolean;
  paymentDate?: Date;
}

export interface UnpaidServicesTableProps {
  services: Service[];
}

const OwesTab = ({ services }: UnpaidServicesTableProps) => {
  return (
    <div className=" ml-8 min-h-[70vh] overflow-x-auto">
      <Table className="min-w-full rounded-xl border border-none border-gray-200 shadow-md ">
        <TableHeader className="">
          <TableRow className=" bg-dark-400  text-left">
            <TableHead className="px-4 py-3 font-semibold text-light-900">
              Ενέργειες
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
                <TableCell className="flex flex-row px-4 py-3">
                  <DropdownMenuAction service={service} />
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
