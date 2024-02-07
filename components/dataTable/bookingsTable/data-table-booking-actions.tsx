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
import Link from "next/link";

export function DataTableBookingRowActions({
  row,
  handleRoomId,
  setOpenDrawer,
}: any) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Ανοιξε menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="background-light900_dark300 text-dark200_light800 w-[160px] font-noto_sans font-bold"
      >
        <DropdownMenuItem
          onClick={() => {
            handleRoomId(row?.original._id);
            setOpenDrawer(true);
          }}
          className="rounded-lg hover:scale-105 hover:bg-sky-300 hover:dark:bg-deep-purple"
        >
          Δημιούργησε Κράτηση
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuSub></DropdownMenuSub>
        <DropdownMenuSeparator />
        {row.original.currentBookings.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted flex  p-0 font-noto_sans font-bold hover:bg-sky-300 hover:dark:bg-deep-purple"
              >
                <span>Επεργασία Κρατήσεων</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="background-light900_dark300 text-dark200_light800 w-[160px] font-noto_sans font-bold"
            >
              {row.original.currentBookings.map((booking: any) => {
                return (
                  <DropdownMenuItem
                    key={booking._id}
                    className="hover:bg-sky-200 hover:dark:bg-deep-purple"
                  >
                    <Link href={`/createbooking/${booking._id}`}>
                      <span>
                        {booking.clientId.firstName + " "}
                        <h1>{booking.clientId.lastName}</h1>
                      </span>{" "}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
