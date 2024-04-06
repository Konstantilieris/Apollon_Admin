"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
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

import { DataTablePagination } from "@/components/dataTable/clientsTable/data-table-pagination";
import { DataTableToolbar } from "@/components/dataTable/clientsTable/data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  facetedFilteringOptions?: {
    column_name: string;
    title: string;
    options: string[];
  };
  viewOptions?: {
    label: string;
    title: string;
    value: string[];
  }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  facetedFilteringOptions,
  viewOptions,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [filtering, setFiltering] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const finalData = React.useMemo(() => data, [data]);
  const finalColumnDef = React.useMemo(() => columns, [columns]);
  // ho

  const table = useReactTable({
    data: finalData,
    columns: finalColumnDef,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter: filtering,
    },
    enableRowSelection: true,
    onGlobalFilterChange: setFiltering,

    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const headerGroup = table.getHeaderGroups()[1];
  return (
    <div className="background-light700_dark300 text-dark200_light800 custom-scrollbar  relative  max-h-[1200px]  gap-2 space-y-4 rounded-lg border-2 border-purple-500  xl:max-w-[1530px] 2xl:max-w-[2150px]">
      <DataTableToolbar
        table={table}
        filtering={filtering}
        setFiltering={setFiltering}
        facetedFilteringOptions={facetedFilteringOptions}
        viewOptions={viewOptions}
      />
      <div className="w-full rounded-md  font-noto_sans font-semibold ">
        <Table>
          <TableHeader className=" p-4 font-noto_sans text-[22px] font-extrabold">
            <TableRow key={headerGroup.id} className="w-full">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="font-extrabold"
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
          </TableHeader>
          <TableBody className=" w-full text-center font-noto_sans">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-[20px]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
