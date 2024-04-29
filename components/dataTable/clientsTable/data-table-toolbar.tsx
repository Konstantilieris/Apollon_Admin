"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/dataTable/clientsTable/data-table-view.options";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { TrainingOption } from "./TraininingOption";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filtering: string;
  setFiltering: any;
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

export function DataTableToolbar<TData>({
  table,
  filtering,
  setFiltering,
  facetedFilteringOptions,
  viewOptions,
  isTrainingOptions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Αναζήτηση"
          value={filtering}
          onChange={(event) => setFiltering(event.target.value)}
          className="background-light900_dark300 text-dark200_light800 h-10 w-[150px] font-noto_sans font-semibold lg:w-[250px]"
        />

        {facetedFilteringOptions &&
          table.getColumn(facetedFilteringOptions.column_name) && (
            <DataTableFacetedFilter
              column={table.getColumn(facetedFilteringOptions.column_name)}
              title={facetedFilteringOptions.title}
              options={facetedFilteringOptions.options}
            />
          )}

        {viewOptions && (
          <DataTableViewOptions table={table} options={viewOptions} />
        )}
        {isTrainingOptions &&
          table.getColumn(isTrainingOptions.column_name) && (
            <TrainingOption
              column={table.getColumn(isTrainingOptions.column_name)}
              title={isTrainingOptions.title}
              options={isTrainingOptions.options}
            />
          )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Εκκαθάριση
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
