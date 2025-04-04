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
import { Payment } from "@/types";

interface PaymentsListProps {
  payments: Payment[];
}

export function PaymentsList({ payments }: PaymentsListProps) {
  if (payments.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex gap-3">
        <Icon icon="lucide:credit-card" className="text-2xl text-default-500" />
        <div className="flex flex-col">
          <p className="text-md">Ιστορικό Πληρωμών</p>
          <p className="text-small text-default-500">
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
            {payments.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell>
                  {new Date(payment.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                <TableCell>{payment.notes || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
