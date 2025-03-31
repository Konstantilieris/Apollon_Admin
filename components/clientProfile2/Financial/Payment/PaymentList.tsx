"use client";
import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Select,
  SelectItem,
  DateRangePicker,
  Tooltip,
  Skeleton,
  Pagination,
  Card,
  CardBody,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { type DateValue } from "@internationalized/date";
import type { RangeValue } from "@react-types/shared";
import { getPaymentsByClientId } from "@/lib/actions/payment.action";
import { PaymentStats } from "./PaymentStats";
import { I18nProvider } from "@react-aria/i18n";
import {
  removeReversedPayment,
  reversePayment,
} from "@/lib/actions/service.action";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
interface ServiceAllocation {
  serviceId: {
    serviceType: string;
    _id: string;
  };
  amount: number;
}

interface Payment {
  _id: string;
  serviceId?: string;
  clientId: string;
  amount: number;
  date: Date;
  notes?: string;
  reversed: boolean;
  allocations?: ServiceAllocation[];
}

interface SortConfig {
  key: keyof Payment;
  direction: "ascending" | "descending";
}

const ROWS_PER_PAGE = 10;

export default function PaymentList({ client }: { client: any }) {
  const { toast } = useToast();
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const path = usePathname();
  const [loading, setLoading] = React.useState(false);
  const [filter, setFilter] = React.useState<"όλες" | "έγκυρες" | "ακυρωμένες">(
    "όλες"
  );
  const [page, setPage] = React.useState(1);
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    key: "date",
    direction: "descending",
  });
  const [dateRange, setDateRange] =
    React.useState<RangeValue<DateValue> | null>(null);

  // Calculate payment statistics
  const paymentStats = React.useMemo(() => {
    const activePayments = payments.filter((p) => !p.reversed);
    const reversedPayments = payments.filter((p) => p.reversed);
    const totalPaidAmount = activePayments.reduce(
      (sum, p) => sum + p.amount,
      0
    );
    const averagePaymentAmount =
      activePayments.length > 0 ? totalPaidAmount / activePayments.length : 0;

    return {
      totalPaidAmount,
      activePaymentsCount: activePayments.length,
      reversedPaymentsCount: reversedPayments.length,
      averagePaymentAmount,
    };
  }, [payments]);

  React.useEffect(() => {
    setPage(1);
  }, [filter, dateRange]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await getPaymentsByClientId({ clientId: client._id });
        console.log("res", res);
        setPayments(res);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [client]);

  const handleSort = (key: keyof Payment) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const filteredAndSortedPayments = React.useMemo(() => {
    let result = [...payments];

    switch (filter) {
      case "έγκυρες":
        result = result.filter((p) => !p.reversed);
        break;
      case "ακυρωμένες":
        result = result.filter((p) => p.reversed);
        break;
    }

    if (dateRange?.start && dateRange?.end) {
      const start = new Date(dateRange.start.toString());
      const end = new Date(dateRange.end.toString());
      result = result.filter((payment) => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= start && paymentDate <= end;
      });
    }

    return result.sort((a, b) => {
      if (sortConfig.key === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortConfig.direction === "ascending"
          ? dateA - dateB
          : dateB - dateA;
      }
      return 0;
    });
  }, [payments, filter, sortConfig, dateRange]);

  const totalPages = Math.ceil(
    filteredAndSortedPayments.length / ROWS_PER_PAGE
  );
  const paginatedPayments = React.useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return filteredAndSortedPayments.slice(start, start + ROWS_PER_PAGE);
  }, [filteredAndSortedPayments, page]);

  const handleReversePayment = async (paymentId: string) => {
    const paymentToUpdate = payments.find((p) => p._id === paymentId);
    if (!paymentToUpdate) return;

    const wasReversed = paymentToUpdate.reversed;

    // Optimistic update
    setPayments((prev) =>
      prev.map((p) =>
        p._id === paymentId ? { ...p, reversed: !p.reversed } : p
      )
    );

    try {
      if (!wasReversed) {
        // Reverse the payment
        const res = await reversePayment({ paymentId, path });
        if (res.success) {
          toast({
            title: "Επιτυχία",
            description: "Η αντιστροφή ολοκληρώθηκε.",
            className: cn(
              "bg-celtic-green border-none text-white text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed font-sans"
            ),
          });
        } else {
          throw new Error("Reverse failed");
        }
      } else {
        // Delete the reversed payment
        const res = await removeReversedPayment({ paymentId, path });
        if (res.message === "success") {
          setPayments((prev) => prev.filter((p) => p._id !== paymentId)); // remove from UI
          toast({
            title: "Επιτυχία",
            description: "Η διαγραφή ολοκληρώθηκε.",
            className: cn(
              "bg-celtic-green border-none text-white text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed font-sans"
            ),
          });
        } else {
          throw new Error("Delete failed");
        }
      }
    } catch (error) {
      console.error("Error handling payment reversal/deletion:", error);

      // Rollback optimistic update
      setPayments((prev) =>
        prev.map((p) =>
          p._id === paymentId ? { ...p, reversed: wasReversed } : p
        )
      );

      toast({
        title: "Σφάλμα",
        description: wasReversed
          ? "Η διαγραφή απέτυχε."
          : "Η αντιστροφή απέτυχε.",
        className: cn(
          "bg-red-500 border-none text-white text-center flex flex-center max-w-[300px] bottom-0 left-0 fixed font-sans"
        ),
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("el-GR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderAllocations = (allocations?: ServiceAllocation[]) => {
    if (!allocations?.length) return "-";

    const total = allocations.reduce(
      (sum, allocation) => sum + allocation.amount,
      0
    );

    return (
      <Tooltip
        content={
          <Card className="w-72 p-0 font-sans" shadow="none">
            <CardBody className="gap-2">
              {allocations?.map((allocation, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-divider py-1 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="lucide:tag"
                      className="h-4 w-4 text-default-400"
                    />
                    <span className="text-sm text-default-600">
                      {allocation?.serviceId?.serviceType}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    €{allocation?.amount?.toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="mt-1 flex items-center justify-between border-t border-divider pt-2">
                <span className="text-sm font-semibold">Σύνολο</span>
                <span className="text-sm font-semibold">
                  €{total.toFixed(2)}
                </span>
              </div>
            </CardBody>
          </Card>
        }
        placement="top"
        delay={1}
        closeDelay={1}
        classNames={{
          content: "p-0",
        }}
      >
        <div className="flex cursor-help items-center gap-2">
          <div className="flex -space-x-2">
            {allocations.slice(0, 3).map((allocation, index) => (
              <Chip
                key={index}
                size="sm"
                variant="flat"
                color="default"
                className="border-1 border-content2"
                classNames={{
                  content: "px-2",
                }}
              >
                €{allocation.amount.toFixed(0)}
              </Chip>
            ))}
            {allocations.length > 3 && (
              <Chip
                size="sm"
                variant="flat"
                color="default"
                className="border-1 border-content2"
                classNames={{
                  content: "px-2",
                }}
              >
                +{allocations.length - 3}
              </Chip>
            )}
          </div>
          <Icon icon="lucide:info" className="h-4 w-4 text-default-400" />
        </div>
      </Tooltip>
    );
  };

  return (
    <Skeleton isLoaded={!loading}>
      <div className="mx-auto w-full space-y-6 p-6">
        <PaymentStats stats={paymentStats} />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Πληρωμές Πελάτη</h1>
            <Select
              label="Φίλτρο Πληρωμών"
              className="w-48"
              defaultSelectedKeys={["όλες"]}
              onChange={(e) =>
                setFilter(e.target.value as "όλες" | "έγκυρες" | "ακυρωμένες")
              }
            >
              <SelectItem key="όλες">Όλες</SelectItem>
              <SelectItem key="έγκυρες">Έγκυρες Πληρωμές</SelectItem>
              <SelectItem key="ακυρωμένες">Ακυρωμένες</SelectItem>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <I18nProvider locale="el-GR">
                <DateRangePicker
                  label="Εύρος Ημερομηνιών"
                  value={dateRange}
                  onChange={(value) => value && setDateRange(value)}
                  className="max-w-xs"
                  classNames={{
                    calendar: "rounded-lg font-sans text-base",
                    label: "font-sans text-base",
                    input: "font-sans text-light-900",

                    calendarContent: "font-sans text-base",
                    selectorButton: "font-sans  text-light-900",
                    selectorIcon: "font-sans text-light-900",
                    segment: "font-sans text-gray-400",
                    base: "font-sans text-light-900",
                    popoverContent: "font-sans text-light-900 text-base",
                    separator: "font-sans text-light-900",
                  }}
                />
              </I18nProvider>
              <Button
                isIconOnly
                variant="flat"
                color="danger"
                onPress={setDateRange.bind(null, null)}
                isDisabled={!dateRange}
              >
                <Icon icon="lucide:x" className="h-4 w-4" />
              </Button>
            </div>
            <Chip variant="flat" color="primary" className="h-full">
              {filteredAndSortedPayments.length} Πληρωμές
            </Chip>
          </div>
        </div>

        <Table
          aria-label="Payments table"
          className="mt-4"
          bottomContent={
            totalPages > 1 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={totalPages}
                  onChange={setPage}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn>
              <Button
                variant="light"
                onPress={() => handleSort("date")}
                className="flex items-center gap-1"
              >
                ΗΜ. ΠΛΗΡΩΜΗΣ
                <Icon
                  icon={
                    sortConfig.key === "date"
                      ? sortConfig.direction === "ascending"
                        ? "lucide:arrow-up"
                        : "lucide:arrow-down"
                      : "lucide:arrow-up-down"
                  }
                  className="h-4 w-4"
                />
              </Button>
            </TableColumn>
            <TableColumn>ΠΟΣΟ</TableColumn>
            <TableColumn>ΚΑΤΑΝΟΜΗ</TableColumn>
            <TableColumn>ΣΗΜΕΙΩΣΕΙΣ</TableColumn>
            <TableColumn>ΚΑΤΑΣΤΑΣΗ</TableColumn>
            <TableColumn>ΕΝΕΡΓΕΙΕΣ</TableColumn>
          </TableHeader>
          <TableBody>
            {paginatedPayments.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell>
                  <Tooltip content={formatDate(payment.date)} placement="right">
                    <span>{formatDate(payment.date)}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>€{payment.amount.toFixed(2)}</TableCell>
                <TableCell>{renderAllocations(payment.allocations)}</TableCell>
                <TableCell>{payment.notes || "-"}</TableCell>
                <TableCell>
                  <Chip
                    color={payment.reversed ? "danger" : "success"}
                    variant="flat"
                    size="sm"
                  >
                    {payment.reversed ? "Ακυρωμένη" : "Ενεργή"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    color={payment.reversed ? "success" : "danger"}
                    variant="flat"
                    onPress={() => handleReversePayment(payment._id)}
                  >
                    <Icon
                      icon={
                        payment.reversed
                          ? "lucide:rotate-ccw"
                          : "lucide:rotate-cw"
                      }
                      className="mr-1 h-4 w-4"
                    />
                    {payment.reversed ? "Διαγραφή" : "Ακύρωση"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Skeleton>
  );
}
