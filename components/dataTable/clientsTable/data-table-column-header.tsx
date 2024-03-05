import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  imgurl?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  imgurl,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent ml-3 h-8 gap-2"
          >
            {imgurl && (
              <Image src={imgurl} alt={"image"} height={26} width={30} />
            )}
            <span className="font-noto_sans text-[22px] font-extrabold">
              {title}
            </span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <CaretSortIcon className="ml-2 h-8 w-5 " />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="background-light900_dark300 text-dark200_light800"
        >
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            <span className="font-noto_sans font-bold"> Asc</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
            <span className="font-noto_sans font-bold"> Desc</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
