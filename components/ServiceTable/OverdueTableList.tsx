import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { RedOwedService } from "./ServiceTopContent";
import { formatCurrency, formatDate } from "@/lib/utils";

interface OverdueServicesListProps {
  services: RedOwedService[];
}

export const OverdueServicesList: React.FC<OverdueServicesListProps> = ({
  services,
}) => {
  if (services.length === 0) {
    return (
      <div className="py-4 text-center text-default-500">
        Ευτυχώς, τίποτα δεν καίει κόκκινο σήμερα!
      </div>
    );
  }

  return (
    <Table
      removeWrapper
      aria-label="Καθυστερημένες Υπηρεσίες"
      classNames={{
        table: "min-w-full",
        th: "text-base font-sans",
        td: "text-base font-sans",
      }}
    >
      <TableHeader>
        <TableColumn>Πελάτης</TableColumn>
        <TableColumn>Υπηρεσία</TableColumn>
        <TableColumn>Ημερομηνία</TableColumn>
        <TableColumn>Υπόλοιπο</TableColumn>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id} className="border-l-2 border-danger-100">
            <TableCell className="max-w-[80px] truncate">
              {service.client.name}
            </TableCell>
            <TableCell className="max-w-[80px] truncate">
              {service.serviceType}
            </TableCell>
            <TableCell>{formatDate(new Date(service.date), "el")}</TableCell>
            <TableCell className="font-medium text-danger">
              {formatCurrency(service.remainingAmount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
