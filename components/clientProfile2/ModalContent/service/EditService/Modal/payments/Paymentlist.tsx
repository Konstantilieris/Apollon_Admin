import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatCurrency } from "@/lib/utils";

interface PaymentsListProps {
  payments: any[]; // Array of payment objects
  serviceId: string; // Pass in the service ID so we know which portion belongs to this service
}

export function PaymentsList({ payments, serviceId }: PaymentsListProps) {
  if (!payments || payments.length === 0) return null;

  // Helper to get the allocated amount for this specific service
  const getAllocatedAmountForService = (payment: any): number => {
    // 1) If payment.serviceId matches our service, then the entire payment is for this service.

    // 2) Otherwise, look in payment.allocations for the portion allocated to this service
    const allocation = payment.allocations?.find(
      (alloc: any) => alloc?.serviceId?._id === serviceId
    );

    return allocation?.amount ?? 0;
  };

  return (
    <Card>
      <CardHeader className="flex gap-3">
        <Icon icon="lucide:credit-card" className="text-2xl text-default-500" />
        <div className="flex flex-col">
          <p className="text-base">Ιστορικό Πληρωμών</p>
          <p className="text-base text-default-500">
            {payments.length} {payments.length === 1 ? "πληρωμή" : "πληρωμές"}{" "}
            καταχωρημένες
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <Table removeWrapper aria-label="Ιστορικό πληρωμών">
          <TableHeader>
            <TableColumn>ΗΜΕΡΟΜΗΝΙΑ</TableColumn>
            <TableColumn>ΠΟΣΟ</TableColumn>
            <TableColumn>ΣΗΜΕΙΩΣΕΙΣ</TableColumn>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => {
              // Calculate how much of this payment is allocated to the specific service
              const allocatedAmount = getAllocatedAmountForService(payment);
              if (allocatedAmount === 0) {
                // If there's no allocation to this service, you might skip rendering
                // or show 0. It's up to you. Here we'll still render the row to show context.
              }
              return (
                <TableRow key={payment._id}>
                  <TableCell>
                    {new Date(payment.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{formatCurrency(allocatedAmount)}</TableCell>
                  <TableCell>{payment.notes || "-"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
