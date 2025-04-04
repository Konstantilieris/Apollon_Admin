import React from "react";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Payment } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ServiceAllocations } from "./ServiceAllocations";
import { ClientInfo } from "./ClientInfo";

interface PaymentDetailsProps {
  payment: Payment;
  client: any;
}

export function PaymentDetails({ payment, client }: PaymentDetailsProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      {/* Header with Status */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Λεπτομέρειες Πληρωμής</h1>
        {payment.reversed && (
          <Chip
            color="danger"
            variant="flat"
            startContent={
              <Icon icon="lucide:alert-triangle" className="text-lg" />
            }
          >
            Ακυρωμένη
          </Chip>
        )}
      </div>

      {/* Payment Overview */}
      <Card>
        <CardHeader className="flex gap-3">
          <Icon
            icon="lucide:credit-card"
            className="text-2xl text-default-500"
          />
          <div className="flex flex-col">
            <p className="text-md">Πληροφορίες Πληρωμής</p>
            <p className="text-small text-default-500">ID: {payment._id}</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-small text-default-500">Ποσό</p>
              <p className="text-xl font-semibold">
                {formatCurrency(payment.amount)}
              </p>
            </div>
            <div>
              <p className="text-small text-default-500">Ημερομηνία</p>
              <p className="text-medium">
                {new Date(payment.date).toLocaleDateString()}
              </p>
            </div>
            {payment.notes && (
              <div className="col-span-2">
                <p className="text-small text-default-500">Σημειώσεις</p>
                <p className="text-medium">{payment.notes}</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Client Info */}
      <ClientInfo client={client} />

      {/* Service Allocations */}
      <ServiceAllocations allocations={payment.allocations ?? []} />
    </div>
  );
}
