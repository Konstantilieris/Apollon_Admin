"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Spinner,
  Link,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Service } from "@/types";
import { formatCurrency, formatDate, getDurationDays } from "@/lib/utils";
import Pagination from "@/components/shared/Pagination";

import FiltersServices from "./FilteredServices";
import RowsPerPageSelector from "../expenses/ExpensesControls/PageControl/RowsPerPageSelector";
import { useModalStore } from "@/hooks/client-profile-store";
import ServicesBulkActions from "./ServicesBulkActions";
import { ServiceTopContent } from "./ServiceTopContent";

/* ---------------------------------------------------------------------
 *  BULK‑ACTION TOOLBAR
 * ------------------------------------------------------------------ */

/* ---------------------------------------------------------------------
 *  MAIN TABLE COMPONENT
 * ------------------------------------------------------------------ */
interface ServicesTableProps {
  initialData: Service[];
  totalPages: number;
  isPaidView?: boolean;
  pieChartData?: any; // Optional, if you want to use it later
  totalRemainingThisMonth?: number; // Optional, if you want to use it later
  topServiceOfWeek?: any; // Optional, if you want to use it later
  barChartData?: any;
  totalOutstandingEver?: number; // Optional, if you want to use it later
  redOwedServices: any; // Optional, if you want to use it later
}

export const ServicesTable: React.FC<ServicesTableProps> = ({
  initialData,
  totalPages,
  isPaidView = false,
  totalOutstandingEver, // Optional, if you want to use it later
  redOwedServices, // Optional, if you want to use it later
  totalRemainingThisMonth, // Optional, if you want to use it later

  // Default to false if not provided
}) => {
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string> | "all">(
    new Set()
  );
  const { openModal } = useModalStore();

  /* totals */
  const totalAmount = React.useMemo(() => {
    return initialData.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  }, [initialData]);

  const selectedCount =
    selectedKeys === "all"
      ? initialData.length
      : (selectedKeys as Set<any>).size;

  const selectedTotalRemaining = React.useMemo(() => {
    const keys =
      selectedKeys === "all"
        ? new Set(initialData.map((s) => s._id))
        : selectedKeys;
    return initialData
      .filter((s) => keys.has(s._id))
      .reduce((sum, s) => sum + (s.remainingAmount || 0), 0);
  }, [initialData, selectedKeys]);

  /* bulk dispatcher */
  const handleBulkAction = (action: string) => {
    if (selectedCount === 0) return;
    const selectedServices =
      selectedKeys === "all"
        ? initialData
        : initialData.filter((s) => (selectedKeys as Set<string>).has(s._id));
    console.log("Selected Services:", selectedServices);
    switch (action) {
      case "fullPay":
        openModal("fullPayServices", { selectedServices });
        break;
      case "partialPay":
        openModal("partialPayService", { selectedServices });
        break;

      case "discount":
        openModal("discountService", { selectedServices });
        break;
      case "delete":
        openModal("deleteServicesTableAction", { selectedServices });
        break;
      case "print":
        console.log("Printing services:", selectedServices);
        break;
      default:
        break;
    }
  };

  /* single‑row actions */
  const renderRowActions = React.useCallback(
    (service: Service) => {
      const disabledKeys: Set<string> = isPaidView
        ? new Set<string>([
            "edit",
            "full-pay",
            "partial-pay",
            "tax",
            "discount",
            "delete",
          ])
        : new Set<string>();

      return (
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="light" size="sm">
              <Icon icon="lucide:more-vertical" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Service actions"
            className="font-sans text-base"
            disabledKeys={disabledKeys}
          >
            <DropdownItem
              key="view"
              startContent={<Icon icon="lucide:eye" />}
              onPress={() =>
                openModal("serviceView", {
                  serviceId: service?._id,
                })
              }
            >
              Προβολή
            </DropdownItem>
            <DropdownItem
              key="edit"
              startContent={<Icon icon="lucide:edit-3" />}
              onPress={() =>
                openModal("editService", { selectedServices: [service] })
              }
            >
              Επεξεργασία
            </DropdownItem>
            <DropdownItem
              key="full-pay"
              startContent={<Icon icon="lucide:credit-card" />}
              onPress={() =>
                openModal("fullPayServices", { selectedServices: [service] })
              }
            >
              Εξόφληση (100%)
            </DropdownItem>
            <DropdownItem
              key="partial-pay"
              startContent={<Icon icon="lucide:divide" />}
              onPress={() =>
                openModal("partialPayService", { selectedServices: [service] })
              }
            >
              Μερική Πληρωμή
            </DropdownItem>
            <DropdownItem
              key="tax"
              startContent={<Icon icon="lucide:percent" />}
              onPress={() => openModal("taxService", { service })}
            >
              Εφαρμογή ΦΠΑ
            </DropdownItem>
            <DropdownItem
              key="discount"
              startContent={<Icon icon="lucide:tag" />}
              onPress={() =>
                openModal("discountService", { selectedServices: [service] })
              }
            >
              Έκπτωση
            </DropdownItem>
            <DropdownItem
              key="delete"
              startContent={<Icon icon="lucide:trash-2" />}
              className="text-danger"
              color="danger"
              onPress={() =>
                openModal("deleteServicesTableAction", {
                  selectedServices: [service],
                })
              }
            >
              Διαγραφή
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
    },
    [openModal, isPaidView]
  );

  /* render */
  return (
    <div className="rounded-lg bg-content1 shadow-md">
      {/* top bar */}
      <div className="flex flex-col gap-2 border-b border-divider p-4">
        <ServiceTopContent
          totalRemainingThisMonth={totalRemainingThisMonth}
          totalOutstandingEver={totalOutstandingEver}
          redOwedServices={redOwedServices}
        />
        <FiltersServices />
        <ServicesBulkActions
          selectedIds={selectedKeys}
          onBulkAction={handleBulkAction}
          selectedCount={selectedCount}
          selectedTotalRemaining={selectedTotalRemaining}
          disableAllActions={isPaidView}
        />
        <div className="flex items-center justify-between pt-2">
          <span className="text-small text-default-400">
            Σύνολο {initialData.length} υπηρεσιών —{" "}
            {formatCurrency(totalAmount)}
          </span>
          <RowsPerPageSelector />
        </div>
      </div>

      {/* main table */}
      <div className="relative">
        {!initialData && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
            <Spinner size="lg" />
          </div>
        )}

        <Table
          bottomContent={<Pagination totalPages={totalPages} />}
          aria-label="Services table"
          selectionMode="multiple"
          selectedKeys={selectedKeys as any}
          onSelectionChange={setSelectedKeys as any}
          isStriped
          color="primary"
          classNames={{
            th: "font-sans text-base font-semibold tracking-wide",
            td: "font-sans text-base",
          }}
        >
          <TableHeader>
            <TableColumn>Πελάτης</TableColumn>
            <TableColumn>Υπηρεσία</TableColumn>
            <TableColumn>Ημερομηνία</TableColumn>
            <TableColumn>Διάρκεια</TableColumn>
            <TableColumn>Αρχ. Ποσό</TableColumn>
            <TableColumn>Έκπτωση</TableColumn>
            <TableColumn>Φ.Π.Α</TableColumn>
            <TableColumn>Τελ. Ποσό</TableColumn>
            <TableColumn>Πληρωμένο</TableColumn>
            <TableColumn>Υπόλοιπο</TableColumn>
            <TableColumn>Ενέργειες</TableColumn>
          </TableHeader>
          <TableBody
            items={initialData}
            emptyContent={<div className="p-4">Δεν βρέθηκαν υπηρεσίες</div>}
          >
            {(service: Service) => (
              <TableRow key={service._id}>
                <TableCell>
                  <Link href={`/client/${service.client?.id}` || "#"}>
                    {service.client?.name || "—"}
                  </Link>
                </TableCell>
                <TableCell>{service.serviceType}</TableCell>
                <TableCell>
                  {formatDate(new Date(service.date), "el")}
                </TableCell>
                <TableCell>
                  {service.endDate
                    ? getDurationDays(service.date, service.endDate)
                    : 0}
                </TableCell>
                <TableCell>{formatCurrency(service.amount)}</TableCell>
                <TableCell className="pl-8  text-danger-600">
                  {service.discount ? formatCurrency(service.discount) : 0}
                </TableCell>
                <TableCell>{formatCurrency(service.taxAmount)}</TableCell>
                <TableCell>{formatCurrency(service.totalAmount)}</TableCell>
                <TableCell>
                  <span className="text-success-600">
                    {formatCurrency(service.paidAmount || 0)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-warning-600">
                    {formatCurrency(service.remainingAmount || 0)}
                  </span>
                </TableCell>
                <TableCell>{renderRowActions(service)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
