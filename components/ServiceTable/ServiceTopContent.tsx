import React from "react";
import { Card, CardBody, Skeleton, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatCurrency } from "@/lib/utils";

type RedOwedService = {
  id: string;
  serviceType: string;
  date: string;
  totalAmount: number;
  remainingAmount: number;
  client: {
    id: string | null;
    name: string;
  };
};

interface ServiceTopContentProps {
  totalRemainingThisMonth: number | undefined;
  topService?: {
    name: string;
    totalAmount: number;
    date: string;
  };
  redOwedServices?: RedOwedService[]; // Optional, if you want to display overdue services
}

export const ServiceTopContent: React.FC<ServiceTopContentProps> = ({
  totalRemainingThisMonth,
  topService,
  redOwedServices = [],
}) => {
  // Calculate total overdue amount
  const totalOverdueAmount = React.useMemo(() => {
    return (
      redOwedServices?.reduce(
        (total, service) => total + service.remainingAmount,
        0
      ) || 0
    );
  }, [redOwedServices]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Monthly Budget KPI */}
      <Card shadow="sm">
        <CardBody className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-warning-500">
            <Icon icon="lucide:wallet" width={24} height={24} />
            <span className="text-sm font-medium text-default-600">
              Υπόλοιπο Μήνα
            </span>
          </div>
          <Divider className="my-1" />
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-warning-600">
              {totalRemainingThisMonth !== undefined ? (
                formatCurrency(totalRemainingThisMonth)
              ) : (
                <Skeleton className="h-8 w-24" />
              )}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-warning-100 px-2 py-1 text-base font-medium text-warning-700">
              <Icon icon="lucide:calendar" width={14} height={14} />
              <span>Τρέχων μήνας</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Top Service KPI */}
      <Card shadow="sm">
        <CardBody className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-success-500">
            <Icon icon="lucide:award" width={24} height={24} />
            <span className="text-sm font-medium text-default-600">
              Top Υπηρεσία Εβδομάδας
            </span>
          </div>
          <Divider className="my-1" />
          {topService ? (
            <>
              <div className="text-xl font-bold text-default-800">
                {topService.name}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-success-600">
                  {formatCurrency(topService.totalAmount)}
                </div>
                <div className="flex items-center gap-1 rounded-full bg-success-100 px-2 py-1 text-base font-medium text-success-700">
                  <Icon icon="lucide:trending-up" width={14} height={14} />
                  <span>Κορυφαία</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-24" />
            </>
          )}
        </CardBody>
      </Card>

      {/* Overdue Services KPI */}
      <Card shadow="lg">
        <CardBody className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-danger-500">
            <Icon icon="lucide:alert-circle" width={24} height={24} />
            <span className="text-base font-medium text-default-600">
              Κόκκινες Οφειλές
            </span>
          </div>
          <Divider className="my-1" />
          {redOwedServices ? (
            <>
              <div className="text-2xl font-bold text-danger-600">
                {formatCurrency(totalOverdueAmount)}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-base text-default-600">
                  {redOwedServices.length}{" "}
                  {redOwedServices.length === 1 ? "υπηρεσία" : "υπηρεσίες"}
                </div>
                <div className="flex items-center gap-1 rounded-full bg-danger-100 px-2 py-1 text-base font-medium text-danger-700">
                  <Icon icon="lucide:alert-triangle" width={14} height={14} />
                  <span>Καθυστερημένες</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-5 w-32" />
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
