"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Tooltip,
  Spinner,
} from "@heroui/react";
import { toast } from "sonner";

import { Icon } from "@iconify/react";
import { PaymentsTableProps } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BulkActionConfirmation } from "./BulkActionConfirmation";
import { CreatePaymentModal } from "./CreatePaymentModal";
import Pagination from "@/components/shared/Pagination";
import FiltersPayments from "./FiltersPayments";
import { TableBulkActions } from "./SelectedContent";
import { TableTopContent } from "./TopContent";
import { useUrlSortDirection } from "@/hooks/useUrlSortDirection";
import {
  removePaymentSafely,
  reversePayment,
} from "@/lib/actions/service.action";
import { PaymentActionModal } from "./PaymentActionModal";

export const PaymentsTable: React.FC<PaymentsTableProps> = ({
  initialData,
  totalAmount,
  totalPages,
}) => {
  const { sortDirection, setSortDirection } = useUrlSortDirection("desc");
  const [showBulkAction, setShowBulkAction] = React.useState<string | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState<any>(null);
  const [currentAction, setCurrentAction] = React.useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set([]));
  const hasSelection = selectedKeys.size > 0 || selectedKeys === "all";

  const openActionModal = (payment: any, action: string) => {
    setSelectedPayment(payment);
    setCurrentAction(action);
  };
  const closeActionModal = () => {
    setSelectedPayment(null);
    setCurrentAction(null);
  };
  const handleSortChange = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };
  // Handle bulk action confirmation
  const handleBulkAction = (action: string) => {
    setShowBulkAction(action);
  };

  // Execute bulk action
  const executeBulkAction = async () => {
    if (!selectedKeys || selectedKeys.size === 0) return;

    const idsToProcess =
      selectedKeys === "all"
        ? initialData.map((p) => p.id)
        : Array.from(selectedKeys as Set<any>);

    try {
      if (showBulkAction === "reverse") {
        await Promise.all(
          idsToProcess.map((id) =>
            reversePayment({ paymentId: id, path: "/payments" })
          )
        );
      } else if (showBulkAction === "delete") {
        await Promise.all(
          idsToProcess.map((id) =>
            removePaymentSafely({ paymentId: id, path: "/payments" })
          )
        );
      } else if (showBulkAction === "print") {
        console.log("Printing payments:", idsToProcess);
      }
      toast.success("Η ενέργεια ολοκληρώθηκε επιτυχώς!");
    } catch (error) {
      console.error("Bulk action error:", error);
      toast.error("Σφάλμα κατά την εκτέλεση της ενέργειας.");
    } finally {
      setShowBulkAction(null);
      setSelectedKeys(new Set());
    }
  };
  // Check if all visible rows are selected

  // Get current date range value for DateRangePicker

  // Calculate total amount of all filtered payments
  const selectedCount = React.useMemo(
    () =>
      selectedKeys === "all"
        ? initialData.length
        : (selectedKeys as Set<any>).size,
    [initialData.length, selectedKeys]
  );

  // Calculate total amount of selected payments
  const selectedTotalAmount = React.useMemo(() => {
    // if the user hit "select all", treat it as every row
    const keysSet =
      selectedKeys === "all"
        ? new Set(initialData.map((p) => p.id))
        : selectedKeys;

    return initialData
      .filter((p) => keysSet.has(p.id))
      .reduce((sum, p) => sum + p.amount, 0);
  }, [initialData, selectedKeys]);

  return (
    <div className="rounded-lg bg-content1 shadow-md">
      {/* Payment summary section */}
      <div className="flex flex-col gap-2 border-b border-divider p-4 ">
        <TableTopContent
          totalAmount={totalAmount}
          selectedIds={selectedKeys}
          openCreatePaymentModal={setIsCreateModalOpen}
          hasSelection={hasSelection}
          selectedCount={selectedCount}
        />
        {/* Filters and controls */}
        <FiltersPayments />
        <TableBulkActions
          selectedIds={selectedKeys}
          onBulkAction={handleBulkAction}
          selectedCount={selectedCount}
          selectedTotalAmount={selectedTotalAmount}
        />
        {/* Bulk actions toolbar */}

        {/* Table */}
        <div className="relative">
          {!initialData && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
              <Spinner size="lg" />
            </div>
          )}

          <Table
            bottomContent={<Pagination totalPages={totalPages} />}
            aria-label="Payments table"
            classNames={{
              th: "font-sans text-base font-semibold tracking-wide",
              td: "font-sans text-base",
            }}
            isStriped
            selectionMode="multiple"
            selectedKeys={selectedKeys as string[]}
            onSelectionChange={setSelectedKeys as any}
          >
            <TableHeader>
              <TableColumn>
                <div
                  className="flex cursor-pointer items-center gap-1"
                  onClick={handleSortChange}
                >
                  Ημ. Πληρωμής
                  <Icon
                    icon={
                      sortDirection === "asc"
                        ? "lucide:arrow-up"
                        : "lucide:arrow-down"
                    }
                    className="text-default-500"
                    width={16}
                  />
                </div>
              </TableColumn>
              <TableColumn>Ον.πελάτη</TableColumn>
              <TableColumn>Υπηρεσία</TableColumn>
              <TableColumn>Ποσό</TableColumn>
              <TableColumn>Κατανομές</TableColumn>
              <TableColumn>Σημειώσεις</TableColumn>
              <TableColumn>Κατάσταση</TableColumn>
              <TableColumn>Ενέργειες</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <div className="py-8 text-center">
                  <Icon
                    icon="lucide:file-x"
                    className="mx-auto mb-2 text-default-400"
                    width={32}
                  />
                  <p>Δεν βρέθηκαν πληρωμές</p>
                  <p className="text-small text-default-400">
                    Δοκιμάστε να αλλάξετε τα φίλτρα ή να προσθέσετε μια νέα
                    πληρωμή.
                  </p>
                </div>
              }
              items={initialData}
            >
              {(payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{formatDate(payment.date, "el")}</TableCell>
                  <TableCell>{payment.clientName}</TableCell>
                  <TableCell>
                    {payment.service ? (
                      <Tooltip
                        content={
                          <div className="px-1 py-2 font-sans">
                            <p className="text-base font-bold">
                              {payment.service.serviceType}
                            </p>
                            {payment.service.date &&
                              payment.service.endDate && (
                                <p className="text-base text-default-400">
                                  {formatDate(payment.service.date, "el")} -{" "}
                                  {formatDate(payment.service.endDate, "el")}
                                </p>
                              )}
                          </div>
                        }
                      >
                        <span className="cursor-help underline decoration-dotted">
                          {payment.service.serviceType}
                        </span>
                      </Tooltip>
                    ) : (
                      <span className="text-default-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    {payment.allocations.length > 0 ? (
                      <Tooltip
                        content={
                          <div className="px-1 py-2 font-sans ">
                            <p className="mb-1 text-base font-bold tracking-wide">
                              ΚΑΤΑΝΟΜΕΣ
                            </p>
                            <ul className="space-y-1">
                              {payment.allocations.map((allocation, index) => (
                                <li key={index} className="text-base">
                                  <span className="font-medium">
                                    {allocation.serviceType}:
                                  </span>{" "}
                                  {formatCurrency(allocation.amount)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        }
                      >
                        <div className="flex cursor-help items-center gap-1">
                          <Icon
                            icon="lucide:layers"
                            className="text-default-500"
                            width={16}
                          />
                          <span className="text-small tracking-wide">
                            {payment.allocations.length}{" "}
                            {payment.allocations.length === 1
                              ? "κατανομή"
                              : "κατανομές"}
                          </span>
                        </div>
                      </Tooltip>
                    ) : (
                      <span className="text-default-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate">
                      {payment.notes || (
                        <span className="text-default-400">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {payment.reversed ? (
                      <Chip
                        color="danger"
                        variant="flat"
                        size="sm"
                        className="text-base tracking-wide"
                      >
                        ακυρωμένη
                      </Chip>
                    ) : (
                      <Chip
                        color="success"
                        variant="flat"
                        size="sm"
                        className="text-base tracking-wide"
                      >
                        έγκυρη
                      </Chip>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dropdown
                      classNames={{
                        trigger: "text-base",
                        content: "font-sans text-base tracking-wide",
                      }}
                    >
                      <DropdownTrigger>
                        <Button isIconOnly variant="light" size="md">
                          <Icon icon="lucide:more-vertical" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Actions">
                        <DropdownItem
                          key="view-details"
                          startContent={<Icon icon="lucide:eye" />}
                          onPress={() =>
                            openActionModal(payment, "view-details")
                          }
                        >
                          Λεπτομέρειες
                        </DropdownItem>
                        <DropdownItem
                          key="reverse-payment"
                          startContent={<Icon icon="lucide:rotate-ccw" />}
                          onPress={() =>
                            openActionModal(payment, "reverse-payment")
                          }
                        >
                          Ακύρωση
                        </DropdownItem>
                        <DropdownItem
                          key="edit-notes"
                          startContent={<Icon icon="lucide:edit-3" />}
                          onPress={() => openActionModal(payment, "edit-notes")}
                        >
                          Επεξεργασία Σημειώσεων
                        </DropdownItem>
                        <DropdownItem
                          key="delete-payment"
                          startContent={<Icon icon="lucide:trash-2" />}
                          className="text-danger"
                          color="danger"
                          onPress={() =>
                            openActionModal(payment, "delete-payment")
                          }
                        >
                          Διαγραφή
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}

        {/* Create Payment Modal */}
        <CreatePaymentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
        {/* Bulk action confirmation dialogs */}
        <BulkActionConfirmation
          isOpen={showBulkAction !== null}
          actionType={showBulkAction || ""}
          count={selectedCount}
          onConfirm={executeBulkAction}
          onCancel={() => setShowBulkAction(null)}
        />
        <PaymentActionModal
          isOpen={!!currentAction}
          onClose={closeActionModal}
          payment={selectedPayment}
          action={currentAction}
        />
      </div>
    </div>
  );
};
