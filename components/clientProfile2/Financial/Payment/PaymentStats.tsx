import React from "react";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

interface PaymentStatsData {
  totalPaidAmount: number;
  activePaymentsCount: number;
  reversedPaymentsCount: number;
  averagePaymentAmount: number;
}

interface PaymentStatsProps {
  stats: PaymentStatsData;
}

export const PaymentStats: React.FC<PaymentStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card shadow="sm">
        <CardBody className="flex items-center gap-4">
          <div className="rounded-lg bg-primary-100 p-2">
            <Icon icon="lucide:euro" className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <p className="text-small text-default-500">Συνολικό Ποσό</p>
            <p className="text-xl font-semibold text-default-700">
              €{stats.totalPaidAmount.toFixed(2)}
            </p>
          </div>
        </CardBody>
      </Card>

      <Card shadow="sm">
        <CardBody className="flex items-center gap-4">
          <div className="rounded-lg bg-success-100 p-2">
            <Icon
              icon="lucide:check-circle"
              className="h-6 w-6 text-success-500"
            />
          </div>
          <div>
            <p className="text-small text-default-500">Ενεργές Πληρωμές</p>
            <p className="text-center text-xl font-semibold text-default-700">
              {stats.activePaymentsCount}
            </p>
          </div>
        </CardBody>
      </Card>

      <Card shadow="sm">
        <CardBody className="flex items-center gap-4">
          <div className="rounded-lg bg-danger-100 p-2">
            <Icon
              icon="lucide:rotate-ccw"
              className="h-6 w-6 text-danger-500"
            />
          </div>
          <div>
            <p className="text-small text-default-500">Ακυρωμένες</p>
            <p className="text-center text-xl font-semibold text-default-700">
              {stats.reversedPaymentsCount}
            </p>
          </div>
        </CardBody>
      </Card>

      <Card shadow="sm">
        <CardBody className="flex items-center gap-4">
          <div className="rounded-lg bg-secondary-100 p-2">
            <Icon
              icon="lucide:calculator"
              className="h-6 w-6 text-secondary-500"
            />
          </div>
          <div>
            <p className="text-small text-default-500">Μέσος Όρος</p>
            <p className="text-xl font-semibold text-default-700">
              €{stats.averagePaymentAmount.toFixed(2)}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
