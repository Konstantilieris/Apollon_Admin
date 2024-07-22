"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect } from "react";
import { DataTablePagination } from "../dataTable/clientsTable/data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const finalData = React.useMemo(() => data, [data]);
  const finalColumnDef = React.useMemo(() => columns, [columns]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, // initial page index
    pageSize: 10,
  }); // Default page size
  useEffect(() => {
    const updatePageSize = () => {
      if (window.matchMedia("(min-width: 2000px)").matches) {
        setPagination({ ...pagination, pageSize: 10 }); // Set page size to 10 for 2XL devices
      } else if (window.matchMedia("(min-width: 1024px)").matches) {
        setPagination({ ...pagination, pageSize: 7 }); // Set page size to 5 for LG devices
      } else {
        setPagination({ ...pagination, pageSize: 5 }); // Default page size
      }
    };

    updatePageSize(); // Initial update

    const resizeHandler = () => {
      updatePageSize();
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);
  const table = useReactTable({
    data: finalData,
    columns: finalColumnDef,

    state: {
      sorting,
      pagination,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="background-light700_dark300  text-dark200_light800 custom-scrollbar  max-h-[1280px] w-full gap-2 space-y-8 rounded-lg border-2 border-purple-700 lg:max-w-[1600px] 2xl:mt-4 2xl:max-w-[2230px]">
      <Table className="w-full">
        <TableHeader className="border-b-2 border-black p-4 font-sans text-[22px] font-extrabold">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="font-extrabold">
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
        <TableBody className=" text-center font-sans">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-black"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
