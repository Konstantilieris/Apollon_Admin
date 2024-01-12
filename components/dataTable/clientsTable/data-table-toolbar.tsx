"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/dataTable/clientsTable/data-table-view.options";
import { TypesOfBehavior } from "@/constants";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { viewClientOptions } from "@/lib/utils";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filtering: string;
  setFiltering: any;
}

export function DataTableToolbar<TData>({
  table,
  filtering,
  setFiltering,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search"
          value={filtering}
          onChange={(event) => setFiltering(event.target.value)}
          className="background-light900_dark300 text-dark200_light800 h-8 w-[150px] font-noto_sans font-semibold lg:w-[250px]"
        />

        {table.getColumn("dog_behavior") && (
          <DataTableFacetedFilter
            column={table.getColumn("dog_behavior")}
            title="behavior"
            options={TypesOfBehavior}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        <DataTableViewOptions table={table} options={viewClientOptions} />
      </div>
    </div>
  );
}
