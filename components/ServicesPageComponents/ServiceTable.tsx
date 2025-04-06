// @ts-nocheck
"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";

import ServiceTabPaid from "./ServiceTabPaid";
import { DropdownMenuAction } from "./DropDownMenu";
import { OwesCard } from "./PaymentCard";
import ServiceModalProvider from "./ServiceModalProvider";
import { useServiceModal } from "@/hooks/use-service-modal";

// -----------------------------------
// 1) Custom hook to detect client mount
// -----------------------------------
function useIsMounted() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

// -----------------------------------
// 2) Type definitions
// -----------------------------------
interface Service {
  _id: string;
  serviceType: string;
  clientId: { _id: string; name: string };
  amount: number;
  paid: boolean;
  paidAmount: number;
  remainingAmount: number;
  date: string;
}

// A label map for column toggles in the Dropdown
const COLUMN_LABELS: Record<string, string> = {
  select: "Επιλογή",
  "clientId.name": "ΠΕΛΑΤΗΣ",
  paidDate: "ΗΜ. ΠΛΗΡΩΜΗΣ",
  amount: "ΠΟΣΟ",
  serviceType: "ΥΠΗΡΕΣΙΑ",
  paidAmount: "ΠΛΗΡΩΘΕΝ",
  remainingAmount: "ΥΠΟΛΟΙΠΟ",
};

// -----------------------------------
// 3) Define columns (mostly static)
// -----------------------------------
const staticColumns: ColumnDef<Service>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "serviceType",
    header: "Υπηρεσία",
  },
  {
    id: "Όνομα Πελάτη",
    accessorFn: (row) => row?.clientId?.name,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ΠΕΛΑΤΗΣ
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="uppercase">{row?.original?.clientId?.name ?? ""}</div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Σύνολο (€)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 pl-6">
        {row.original.amount.toFixed(2) + " €"}
      </div>
    ),
  },
  {
    accessorKey: "paidAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Πλήρωθεν (€)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 pl-6">
        {row.original.paidAmount.toFixed(2) + " €"}
      </div>
    ),
  },
  {
    accessorKey: "remainingAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Υπόλοιπο (€)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 pl-6">
        {row.original.remainingAmount.toFixed(2) + " €"}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const service = row.original;
      if (service.paid) {
        return null;
      }
      return <DropdownMenuAction service={service} />;
    },
  },
];

// -----------------------------------
// 4) Main Table Component
// -----------------------------------
export function ServicesTable({ services }: { services: Service[] }) {
  const isMounted = useIsMounted(); // ensures no SSR mismatch
  const searchParams = useSearchParams();
  const paid = searchParams.get("paid") === "true";
  const { isOpen } = useServiceModal();
  // Basic sums
  const totalAmount = React.useMemo(
    () => services.reduce((acc, service) => acc + service.amount, 0),
    [services]
  );
  const owesTotal = React.useMemo(
    () => services.reduce((acc, service) => acc + service.remainingAmount, 0),
    [services]
  );

  // Table states
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Create the table instance
  const table = useReactTable({
    data: services,
    columns: staticColumns, // <--- mostly static
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel({ initialSync: true }),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // meta: { paid }, // if you need "paid" in your cells or headers
  });

  // We skip rendering until client mount if we want to avoid SSR mismatch
  if (!isMounted) return null;

  // Calculate sums for SELECTED rows:
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const totalSelectedAmount = selectedRows.reduce(
    (acc, row) => acc + row.original.amount,
    0
  );
  const totalSelectedPaid = selectedRows.reduce(
    (acc, row) => acc + row.original.paidAmount,
    0
  );
  const totalSelectedRemaining = selectedRows.reduce(
    (acc, row) => acc + row.original.remainingAmount,
    0
  );
  console.log("SERVICES", selectedRows);
  return (
    <>
      {isOpen && <ServiceModalProvider />}
      <Card className="h-full border-none">
        {/* Top Info Row */}
        <div className="flex w-full items-center px-4 py-2">
          <OwesCard
            revenue={paid ? totalAmount : owesTotal}
            className="mb-4 mr-4"
          />
        </div>

        <CardContent>
          <div className="mb-4 flex w-full items-center gap-4">
            {/* Example: Filter by client's name */}
            <div className="flex items-center gap-4">
              <Input
                placeholder="Αναζήτηση με όνομα πελάτη"
                value={
                  (table
                    .getColumn("Όνομα Πελάτη")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("Όνομα Πελάτη")
                    ?.setFilterValue(event.target.value)
                }
                className="h-14 w-60 bg-neutral-800"
              />
              <ServiceTabPaid />
            </div>

            {/* Column Toggle Dropdown */}
            <div className="flex w-full flex-row items-center justify-end gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-14 w-40 text-base uppercase"
                  >
                    ΣΤΗΛΕΣ <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-neutral-900">
                  {table
                    .getAllColumns()
                    .filter((col) => col.getCanHide())
                    .map((col, index) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={col.id}
                          className="font-sans text-[1rem] capitalize transition-colors duration-300 hover:text-indigo-500"
                          checked={col.getIsVisible()}
                          onCheckedChange={(value) =>
                            col.toggleVisibility(value)
                          }
                        >
                          {COLUMN_LABELS[col.id] ?? col.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* The Table */}
          <div className="flex-1 overflow-auto rounded-md border bg-neutral-900 font-sans">
            <Table className="h-full">
              <TableHeader>
                {selectedRows.length > 0 && (
                  <TableRow>
                    {/* We have 7 columns total in staticColumns */}
                    <TableHead colSpan={3} className="text-center">
                      <span className="font-semibold uppercase tracking-widest">
                        Επιλεγμένα Στοιχεία
                      </span>
                    </TableHead>
                    <TableHead colSpan={1} className="pl-12 text-start">
                      {totalSelectedAmount.toFixed(2)}€
                    </TableHead>
                    <TableHead colSpan={1} className="pl-12  text-start">
                      {totalSelectedPaid.toFixed(2)}€
                    </TableHead>
                    <TableHead colSpan={1} className="pl-12  text-start">
                      {totalSelectedRemaining.toFixed(2)}€
                    </TableHead>
                    {/* 'actions' column has no sum */}
                    <TableHead colSpan={1}></TableHead>
                  </TableRow>
                )}
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="[&:has([role=checkbox])]:pl-3"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
                {/* Extra row to show sums of SELECTED rows */}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const { paid } = row.original;
                        return (
                          <TableCell
                            key={cell.id}
                            className={cn(`[&:has([role=checkbox])]:pl-3`, {
                              "text-green-500":
                                paid && cell.column.id === "paidAmount",
                            })}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={staticColumns.length}
                      className="h-24 text-center"
                    >
                      Δεν υπάρχουν αποτελέσματα
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination & Info */}
          <div className="flex items-center justify-end space-x-2 pt-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {selectedRows.length} από{" "}
              {table.getFilteredRowModel().rows.length} σειρές επιλέχθηκαν
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                ΠΡΟΗΓΟΥΜΕΝΟ
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                ΕΠΟΜΕΝΟ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
