// @ts-nocheck
"use client";

import * as React from "react";
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import CreatePaymentTrigger from "../payments/PaymentSheet";
import PaymentsTabReverse from "./PaymentsTabReverse";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  removeReversedPayment,
  reversePayment,
} from "@/lib/actions/service.action";
import { RevenueCard } from "./RevenueCard";

/**
 * Payment type definition
 */

type Payment = {
  _id: string;
  amount: number;
  clientId: {
    _id: string;
    name: string;
  };
  serviceId?: {
    _id: string;
    serviceType: string;
  };
  date: string; // or Date, if you prefer
  notes: string;
  reversed: boolean;
  __v: number;
  allocations: Array<{
    _id: string;
    amount: number;
    serviceId: {
      _id: string;
      serviceType: string;
    };
  }>;
};

/**
 * Table columns for the Payment type
 */
export const columns: ColumnDef<Payment>[] = [
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
  // 1) Client (via clientId.name)
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
  // 2) Date
  {
    accessorKey: "date",
    id: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ΗΜ. ΠΛΗΡΩΜΗΣ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateString = row.getValue<string>("date");
      const date = new Date(dateString);
      return (
        <div className="ml-8">
          {date.toLocaleDateString("el-GR", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  // 3) Amount
  {
    accessorKey: "amount",
    id: "amount",
    header: ({ column, table }) => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ΠΟΣΟ
            <ArrowUpDown className="ml-2 h-4 w-4" />
            {/* Total Selected Amount */}
          </Button>
          <span
            className={cn(
              "ml-2 w-32 rounded-lg  bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-center text-sm text-light-900",
              {
                "from-red-500 to-red-600": table?.options?.meta?.reverse,
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
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(amount);

      return <div className="ml-6 text-start font-medium">{formatted}</div>;
    },
  },
  // 4) Reversed
  {
    accessorKey: "services",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Υπηρεσίες
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const serviceName =
        row.original.serviceId?.serviceType ?? "Πολλαπλές υπηρεσίες";
      return <div className="ml-6 text-start">{serviceName}</div>;
    },
  },
  // 5) Notes
  {
    accessorKey: "notes",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ΣΗΜΕΙΩΣΕΙΣ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const notes = row.getValue<string>("notes");
      return <div className="whitespace-pre-wrap">{notes}</div>;
    },
  },
  // 6) Actions
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className=" bg-neutral-900  font-sans text-light-900"
          >
            <DropdownMenuLabel className="text-lg">Ενέργειες</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                const handlePayment = async () => {
                  if (!payment.reversed) {
                    try {
                      await reversePayment({
                        paymentId: payment._id,
                      });
                    } catch (error) {
                      console.error("Error reversing payment:", error);
                    } finally {
                      window.location.reload();
                    }
                  } else {
                    try {
                      await removeReversedPayment({
                        paymentId: payment._id,
                        path: "/payments",
                      });
                    } catch (error) {
                      console.error("Error deleting payment:", error);
                    } finally {
                      window.location.reload();
                    }
                  }
                };
                handlePayment();
              }}
              className="text-lg transition-colors duration-300 hover:text-indigo-500"
            >
              {row.original.reversed ? "Διαγραφή" : "Ανάκληση"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-lg transition-colors duration-300 hover:text-indigo-500">
              <Link href={`/client/${payment.clientId._id}`}>
                Πήγαινε στον Πελάτη
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-lg transition-colors duration-300 hover:text-indigo-500">
              Λεπτομέρειες πληρωμής
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

/**
 * PaymentsDataTable
 * Re-usable table component for listing Payments
 */
export function PaymentsDataTable({
  payments,
  revenue,
}: {
  payments: Payment[];
  revenue: number;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const searchParams = useSearchParams();
  const reverse = searchParams.get("reverse") === "true";

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [mount, setMount] = React.useState(false);
  const table = useReactTable<Payment>({
    data: payments,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

  // For the dropdown that shows/hides columns, we map the column id to a readable label
  const columnList: Record<string, string> = {
    select: "Επιλογή",
    "clientId.name": "ΠΕΛΑΤΗΣ",
    date: "ΗΜ. ΠΛΗΡΩΜΗΣ",
    amount: "ΠΟΣΟ",
    services: "ΥΠΗΡΕΣΙΕΣ",
    reversed: "ΑΝΑΚΛΗΘΗΚΕ",
    notes: "ΣΗΜΕΙΩΣΕΙΣ",
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
        <RevenueCard revenue={revenue} className={"mb-4 mr-4"} />
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
            <PaymentsTabReverse />
          </div>

          <div className="flex w-full flex-row items-center justify-end gap-2">
            <CreatePaymentTrigger />
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
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          `[&:has([role=checkbox])]:pl-3`,
                          {
                            "text-red-500":
                              // Highlight the amount cell in red if the payment is reversed and the column is amount
                              reverse && cell.column.id === "amount",
                          },
                          {
                            "line-through":
                              reverse &&
                              cell.column.id !== "amount" &&
                              cell.column.id !== "date",
                          }
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
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
