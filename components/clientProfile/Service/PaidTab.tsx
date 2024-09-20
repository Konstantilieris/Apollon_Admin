import {
  TableHeader,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { stringToHexColor } from "@/lib/utils";
import React from "react";

const PaidTab = ({ services }: any) => {
  return (
    <div className=" ml-8 min-h-[70vh] overflow-x-auto">
      <Table className="min-w-full rounded-xl border border-none border-gray-200 shadow-md ">
        <TableHeader className="">
          <TableRow className=" bg-dark-400  text-left">
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
            <TableHead className="px-4 py-3 text-center font-semibold text-light-900">
              Ημερομηνία Πληρωμής
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service: any, index: number) => {
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
              <TableRow key={index} className="bg-dark-300 text-left">
                <TableCell className="px-4 py-3">{serviceType}</TableCell>
                <TableCell className="px-4  pl-6 ">
                  {service.amount} €{" "}
                </TableCell>
                <TableCell className="px-4 py-3">{service.notes}</TableCell>
                <TableCell className="px-4 py-3" style={{ color }}>
                  {service.bookingId}
                </TableCell>
                <TableCell className="px-4 py-3">
                  {" "}
                  {new Date(service.date).toLocaleDateString("el-GR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className=" text-center">
                  {service.paymentDate
                    ? new Date(service.paymentDate).toLocaleDateString(
                        "el-GR",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )
                    : "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaidTab;
