import React from "react";
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

import { formatCurrency } from "@/lib/utils";
import { BookingDetails } from "./BookingDetails";
import { PaymentsList } from "./Paymentlist";

export function ServiceDetails({ service }: any) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Λεπτομέρειες Υπηρεσίας</h1>
        <Chip
          color={service.paid ? "success" : "danger"}
          variant="flat"
          startContent={
            <Icon
              icon={service.paid ? "lucide:check-circle" : "lucide:x-circle"}
              className="text-lg"
            />
          }
        >
          {service.paid ? "Εξοφλημένη" : "Μη εξοφλημένη"}
        </Chip>
      </div>

      <Card>
        <CardHeader className="flex gap-3">
          <Icon icon="lucide:briefcase" className="text-2xl text-default-500" />
          <div className="flex flex-col">
            <p className="text-md">{service.serviceType}</p>
            <p className="text-small text-default-500">ID: {service._id}</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-small text-default-500">Ποσό</p>
              <p className="text-medium">{formatCurrency(service.amount)}</p>
            </div>
            <div>
              <p className="text-small text-default-500">Έκπτωση</p>
              <p className="text-medium">
                {formatCurrency(service.discount ?? 0)}
              </p>
            </div>
            <div>
              <p className="text-small text-default-500">Πληρωμένο Ποσό</p>
              <p className="text-medium">
                {formatCurrency(service.paidAmount ?? 0)}
              </p>
            </div>
            <div>
              <p className="text-small text-default-500">Υπόλοιπο</p>
              <p className="text-medium">
                {formatCurrency(service.remainingAmount ?? 0)}
              </p>
            </div>
            <div className="col-span-2">
              <Divider className="my-2" />
            </div>
            <div>
              <p className="text-small text-default-500">Ημερομηνία</p>
              <p className="text-medium">
                {new Date(service.date).toLocaleDateString()}
              </p>
            </div>
            {service.paymentDate && (
              <div>
                <p className="text-small text-default-500">
                  Ημερομηνία Πληρωμής
                </p>
                <p className="text-medium">
                  {new Date(service.paymentDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {service.bookingId && service.booking && (
        <BookingDetails booking={service.booking} />
      )}

      <PaymentsList payments={service.payments ?? []} />
    </div>
  );
}
