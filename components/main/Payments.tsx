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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
import { id } from "date-fns/locale";

export type Service = {
  id: string;
  serviceType: string;
  clientName: string;
  clientId: string;
  paid: boolean;
  amount: number;
  date: string;
  paymentDate: string;
};

export const columns: ColumnDef<Service>[] = [
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
    header: "ΟΝ. ΥΠΗΡΕΣΙΑΣ",
    cell: ({ row }) => <div>{row.getValue("serviceType")}</div>,
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ΠΕΛΑΤΗΣ
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className=" uppercase">{row.getValue("clientName")}</div>
    ),
  },
  {
    accessorKey: "date",
    // Sort by date
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ΗΜ. ΠΑΡΟΧΗΣ
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-8">
        {new Date(row.getValue("date")).toLocaleDateString("el-GR", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>
    ),
  },
  {
    accessorKey: "paid",
    // Sort by paid status
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ΕΞΟΦΛΕΙΜΕΝΟ
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-12 capitalize">
        {row.getValue("paid") ? "NAI" : "OXI"}
      </div>
    ),
  },
  {
    accessorKey: "paymentDate",
    // Sort by payment date
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ΗΜ. ΠΛΗΡΩΜΗΣ
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const paymentDate = row.getValue("paymentDate");
      return typeof paymentDate === "string" ||
        typeof paymentDate === "number" ? (
        <span className="ml-8">
          {new Date(paymentDate).toLocaleDateString("el-GR", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ) : (
        <span className="ml-8 tracking-widest text-red-500">ΑΠΛΗΡΩΤΟ</span>
      );
    },
  },
  {
    accessorKey: "amount",
    // sort by amount
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ΣΥΝΟΛΟ
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(amount);

      return <div className="ml-6 text-start font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">ΜΕΝΟΥ</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className=" bg-neutral-900  font-sans text-light-900"
          >
            <DropdownMenuLabel className="text-lg ">
              Ενέργειες
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
              className="text-lg transition-colors duration-300 hover:text-indigo-500 "
            >
              Εκτύπωση
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-lg transition-colors duration-300 hover:text-indigo-500 ">
              <Link href={`/clients/${payment.clientId}`}>
                {" "}
                Πηγαινε στον Πελάτη
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-lg transition-colors duration-300 hover:text-indigo-500 ">
              Λεπτομέρειες υπηρεσίας
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function PaymentsDataTable({ services }: { services: Service[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: services,
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
  const columnList: any = {
    serviceType: "ΟΝ. ΥΠΗΡΕΣΙΑΣ",
    clientName: "ΠΕΛΑΤΗΣ",
    date: "ΗΜ. ΠΑΡΟΧΗΣ",
    paid: "ΕΞΟΦΛΕΙΜΕΝΟ",
    paymentDate: "ΗΜ. ΠΛΗΡΩΜΗΣ",
    amount: "ΣΥΝΟΛΟ",
  };

  return (
    <Card className="h-full border-none ">
      <CardHeader>
        <CardTitle>ΕΣΟΔΑ</CardTitle>
        <CardDescription>ΔΙΑΧΕΙΡΙΣΟΥ ΤΙΣ ΠΛΗΡΩΜΕΣ</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex w-full  items-center gap-4">
          <Input
            placeholder="Ψάξε με πελάτη"
            value={
              (table.getColumn("clientName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("clientName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex w-full flex-row items-center justify-end gap-2 ">
            <CreatePaymentTrigger />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="">
                  Στήλες <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-neutral-900 ">
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
                        {columnList[column.id]}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border bg-neutral-900 font-sans">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
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
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="[&:has([role=checkbox])]:pl-3"
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
            {table.getFilteredSelectedRowModel().rows.length} απο{" "}
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
