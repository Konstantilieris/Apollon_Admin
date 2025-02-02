// @ts-nocheck
"use client";

import * as React from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
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
import { useSearchParams } from "next/navigation";
import { OwesCard } from "./PaymentCard";

// Define Service Type
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

// Define Columns
const columns: ColumnDef<Service>[] = [
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
    accessorFn: (row) => row.clientId.name,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ΠΕΛΑΤΗΣ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="uppercase">{row.original.clientId.name}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column, table }) => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Σύνολο (€)
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {/* Total Selected Amount */}
          </Button>
          <span
            className={cn(
              "ml-2 w-32 rounded-lg  bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-center text-sm text-light-900",
              {
                "from-red-500 to-red-600": table?.options?.meta?.paid,
              }
            )}
          >
            {table
              .getFilteredSelectedRowModel()
              .rows.reduce((acc, row) => acc + row.original.amount, 0)}
            €
          </span>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2 pl-6">
        {row.original.amount.toFixed(2) + " €"}
      </div>
    ),
  },
  {
    accessorKey: "paidAmount",
    header: ({ column, table }) => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Πλήρωθεν (€)
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {/* Total Selected Amount */}
          </Button>
          <span
            className={cn(
              "ml-2 w-32 rounded-lg  bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-center text-sm text-light-900",
              {
                "from-red-500 to-red-600": table?.options?.meta?.paid,
              }
            )}
          >
            {table
              .getFilteredSelectedRowModel()
              .rows.reduce((acc, row) => acc + row.original.paidAmount, 0)}
            €
          </span>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2 pl-6">
        {row.original.paidAmount.toFixed(2) + " €"}
      </div>
    ),
  },
  {
    accessorKey: "remainingAmount",
    header: ({ column, table }) => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Υπόλοιπο (€)
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {/* Total Selected Amount */}
          </Button>
          <span
            className={cn(
              "ml-2 w-32 rounded-lg  bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-center text-sm text-light-900",
              {
                "from-red-500 to-red-600": table?.options?.meta?.paid,
              }
            )}
          >
            {table
              .getFilteredSelectedRowModel()
              .rows.reduce((acc, row) => acc + row.original.remainingAmount, 0)}
            €
          </span>
        </div>
      );
    },
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

export function ServicesTable({ services }: { services: Service[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const searchParams = useSearchParams();
  const paid = searchParams.get("paid") === "true";
  const totalAmount = services.reduce(
    (acc, service) => acc + service.amount,
    0
  );
  const owesTotal = services.reduce(
    (acc, service) => acc + service.remainingAmount,
    0
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [mount, setMount] = React.useState(false);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data: services,
    columns,

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel({
      initialSync: true,
    }),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const columnList: Record<string, string> = {
    select: "Επιλογή",
    "clientId.name": "ΠΕΛΑΤΗΣ",
    paidDate: "ΗΜ. ΠΛΗΡΩΜΗΣ",
    amount: "ΠΟΣΟ",
    serviceType: "ΥΠΗΡΕΣΙΕΣ",
    paidAmount: "ΠΛΗΡΩΘΕΝ",
    remainingAmount: "ΥΠΟΛΟΙΠΟ",
  };
  React.useEffect(() => {
    if (!mount) {
      setMount(true);
    }
  }, [mount]);
  if (!mount) return null;
  return (
    <Card className="h-full border-none">
      <div className="flex w-full items-center px-4 py-2">
        <OwesCard
          revenue={paid ? totalAmount : owesTotal}
          className={"mb-4 mr-4"}
        />
      </div>
      <CardContent>
        <div className="mb-4 flex w-full items-center gap-4">
          {/* Example: Filter by client's name */}
          <div className="flex items-center gap-4 ">
            <Input
              placeholder="Αναζήτηση με όνομα πελάτη"
              value={
                (table.getColumn("Όνομα Πελάτη")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("Όνομα Πελάτη")
                  ?.setFilterValue(event.target.value)
              }
              className="h-14 w-60"
            />
            <ServiceTabPaid />
          </div>

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
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="font-sans text-[1rem] capitalize transition-colors duration-300 hover:text-indigo-500"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {columnList[column.id] ?? column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-md border bg-neutral-900 font-sans">
          <Table className="h-full">
            <TableHeader>
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
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const paid = row.original.paid;
                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(`[&:has([role=checkbox])]:pl-3`, {
                            "text-green-500":
                              // Highlight the amount cell in red if the payment is reversed and the column is amount
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
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Δεν υπάρχουν αποτελέσματα
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} από{" "}
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
  );
}
