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
import { useEffect } from "react";

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
  isTrainingOptions?: {
    column_name: string;
    title: string;

    options: any;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  facetedFilteringOptions,
  viewOptions,
  isTrainingOptions,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, // initial page index
    pageSize: 10,
  });
  const [filtering, setFiltering] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const finalData = React.useMemo(() => data, [data]);
  const finalColumnDef = React.useMemo(() => columns, [columns]);
  // ho
  useEffect(() => {
    const updatePageSize = () => {
      if (window.matchMedia("(min-width: 2000px)").matches) {
        setPagination({ ...pagination, pageSize: 10 }); // Set page size to 10 for 2XL devices
      } else if (window.matchMedia("(min-width: 1024px)").matches) {
        setPagination({ ...pagination, pageSize: 5 }); // Set page size to 5 for LG devices
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
        isTrainingOptions={isTrainingOptions}
      />
      <div className="w-full rounded-md  font-sans font-semibold ">
        <Table>
          <TableHeader className=" p-4 font-sans text-[22px] font-extrabold">
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
          <TableBody className=" w-full text-center font-sans">
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
