import React from "react";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { Service } from "../types/service";

interface ServicesSummaryProps {
  services: Service[];
}

export function ServicesSummary({ services }: ServicesSummaryProps) {
  const totals = React.useMemo(() => {
    return services.reduce(
      (acc, service) => ({
        total: acc.total + service.totalAmount,
        paid: acc.paid + service.paidAmount,
        remaining: acc.remaining + service.remainingAmount,
      }),
      { total: 0, paid: 0, remaining: 0 }
    );
  }, [services]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardBody className="flex items-center gap-4">
          <div className="rounded-lg bg-primary-100 p-2">
            <Icon
              icon="lucide:credit-card"
              className="h-6 w-6 text-primary-500"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">Συνολικό Ποσό</p>
            <p className="text-center text-xl font-semibold">
              {formatCurrency(totals.total)}
            </p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="flex items-center gap-4">
          <div className="rounded-lg bg-success-100 p-2">
            <Icon
              icon="lucide:check-circle"
              className="h-6 w-6 text-success-500"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">Συνολικά Πληρωμένα</p>
            <p className="text-center text-xl font-semibold text-success-600">
              {formatCurrency(totals.paid)}
            </p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="flex items-center gap-4">
          <div className="rounded-lg bg-warning-100 p-2">
            <Icon icon="lucide:clock" className="h-6 w-6 text-warning-500" />
          </div>
          <div>
            <p className=" text-sm text-gray-500">Συνολικό Υπόλοιπο</p>
            <p className="text-center text-xl font-semibold text-warning-600">
              {formatCurrency(totals.remaining)}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
