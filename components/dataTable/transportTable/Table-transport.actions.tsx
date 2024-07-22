"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";

export function DataTableRowActions({ row }: any) {
  const router = useRouter();
  const navigateProfile = () => {
    router.push(`/clients/${row.original.clientId._id}`);
  };
  const navigateEdit = () => {
    router.push(`/transport/${row.original._id}`);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="background-light900_dark300 text-dark200_light800 w-[200px]  font-sans font-bold"
      >
        {" "}
        <DropdownMenuItem
          className="rounded-lg hover:scale-105 hover:bg-fuchsia-500"
          onClick={navigateProfile}
        >
          Προφίλ Πελάτη
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={navigateEdit}
          className="flex flex-row rounded-lg hover:scale-105 hover:bg-fuchsia-500"
        >
          Τροποποίηση Μεταφοράς
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub></DropdownMenuSub>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
