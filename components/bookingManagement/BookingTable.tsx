"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Skeleton,
  Chip,
  Button,
  ButtonGroup,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import TopContent from "./TopContent";
import Pagination from "../shared/Pagination";
import { formatDateUndefined2 } from "@/lib/utils";
import { useModalStore } from "@/hooks/client-profile-store";

interface Booking {
  _id: string;
  clientName: string;
  clientPhone: string;
  clientLocation: string;
  transportFee: number;
  bookingFee: number;
  fromDate: string;
  toDate: string;
  extraDay: boolean;
  services: string[];
  totalAmount: number;
  dogs: string[];
  flag1: boolean;
  flag2: boolean;
  duration: number;
}

const columns = [
  { key: "clientName", label: "Όνομα Πελάτη" },
  { key: "clientPhone", label: "Τηλέφωνο" },
  { key: "clientLocation", label: "Τοποθεσία" },
  { key: "transportFee", label: "Κόστος Μεταφοράς" },
  { key: "bookingFee", label: "Κόστος Κράτησης" },
  { key: "fromDate", label: "Από Ημερομηνία" },
  { key: "toDate", label: "Έως Ημερομηνία" },
  { key: "extraDay", label: "Επιπλέον Ημέρα" },
  { key: "duration", label: "Διάρκεια" },
  { key: "totalAmount", label: "Συνολικό Ποσό" },
  { key: "dogs", label: "Σκύλοι" },
  { key: "flag1", label: "PetTaxi Άφιξη" },
  { key: "flag2", label: "PetTaxi Αναχώρηση" },
  { key: "actions", label: "Ενέργειες" },
];

const BookingsTable = ({
  bookings,
  totalPages,
}: {
  bookings: Booking[];
  totalPages: number;
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedKeys, setSelectedKeys] = React.useState<any>(new Set([]));
  const rowsPerPage = 15;
  const { openModal } = useModalStore();
  const hasSelection = selectedKeys.size > 0 || selectedKeys === "all";
  // totalSelectedAmount when selectedKeys is a string ALL then totalSelectedAmount is all bookings total amount
  const totalSelectedAmount =
    selectedKeys === "all"
      ? bookings.reduce((sum: any, b) => sum + b.totalAmount, 0)
      : Array.from(selectedKeys).reduce((sum: any, id) => {
          const booking = bookings.find((b) => b._id === id);
          return booking ? sum + booking.totalAmount : sum;
        }, 0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleView = (id: string) => {
    openModal("viewBooking", { bookingId: id });
    // Implement your view logic here
  };

  const handleEdit = (id: string) => {
    if (!id) return;
    openModal("editBooking", { bookingId: id });
  };

  const renderCell = (
    booking: Booking,
    columnKey: keyof Booking | "actions"
  ) => {
    const cellValue = booking[columnKey as keyof Booking];

    if (columnKey === "actions") {
      return (
        <ButtonGroup size="sm" variant="flat">
          <Tooltip content="Προβολή">
            <Button
              isIconOnly
              color="primary"
              onPress={() => handleView(booking._id)}
            >
              <Icon icon="lucide:eye" className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Επεξεργασία">
            <Button
              isIconOnly
              color="secondary"
              onPress={() => handleEdit(booking._id)}
            >
              <Icon icon="lucide:edit" className="h-4 w-4" />
            </Button>
          </Tooltip>
        </ButtonGroup>
      );
    }

    switch (columnKey) {
      case "extraDay":
      case "flag1":
      case "flag2":
        return (
          <Chip
            color={cellValue ? "success" : "default"}
            variant="flat"
            size="sm"
            className="ml-4 text-base tracking-widest"
          >
            {cellValue ? "Ναι" : "Όχι"}
          </Chip>
        );
      case "duration": {
        // normalise dates to midnight to avoid off‑by‑one headaches
        const from = new Date(booking.fromDate);
        const to = new Date(booking.toDate);

        // milliseconds in a day
        const MS_DAY = 1000 * 60 * 60 * 24;

        const diffDays = Math.max(
          0,
          Math.ceil(
            (to.setHours(0, 0, 0, 0) - from.setHours(0, 0, 0, 0)) / MS_DAY
          )
        );

        return `${diffDays}`; // e.g. “2”
      }

      case "dogs":
        return (cellValue as string[])?.join(", ");
      case "fromDate":
      case "toDate":
        return typeof cellValue === "string" || typeof cellValue === "number"
          ? formatDateUndefined2(new Date(cellValue), "el-GR")
          : "Invalid Date";
      case "transportFee":
      case "bookingFee":
        return cellValue ? `€${(cellValue as number)?.toFixed(2)}` : "-";
      case "totalAmount":
        return `€${(cellValue as number)?.toFixed(2)}`;
      default:
        return cellValue;
    }
  };

  const LoadingRow = () => (
    <TableRow>
      {columns.map((column) => (
        <TableCell key={column.key}>
          <Skeleton className="h-8 w-full rounded-lg" />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <div className="w-full space-y-4">
      <h1 className="font-semibold tracking-widest">ΔΙΑΧΕΙΡΗΣΗ ΚΡΑΤΗΣΕΩΝ</h1>
      <Table
        aria-label="Πίνακας Κρατήσεων"
        isStriped
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys as any}
        topContent={
          <TopContent
            hasSelection={hasSelection}
            selectedKeys={selectedKeys}
            totalSelectedAmount={totalSelectedAmount}
          />
        }
        bottomContent={<Pagination totalPages={totalPages} />}
        removeWrapper
        classNames={{
          wrapper: "min-h-[400px]",
          th: "text-base tracking-wide",
          td: "text-base",
        }}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody
          emptyContent="Δεν βρέθηκαν κρατήσεις"
          loadingContent={Array(rowsPerPage)
            .fill(0)
            .map((_, index) => (
              <LoadingRow key={index} />
            ))}
          isLoading={isLoading}
          items={bookings}
        >
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey: any) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingsTable;
