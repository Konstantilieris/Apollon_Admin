"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../clientsTable/data-table-column-header";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { DataTableRowActions } from "./Table-training-actions";
export const trainingColumns: ColumnDef<any>[] = [
  {
    id: "Training",
    header: () => {
      return <div className="bg-white text-center">ΣΥΣΤΗΜΑ ΕΚΠΑΙΔΕΥΣΕΩΝ</div>;
    },
    enableSorting: true,
    enableGlobalFilter: true,
    columns: [
      {
        id: "actions",
        enableHiding: false,

        cell: ({ row }) => <DataTableRowActions row={row} />,
      },
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="ΕΚΠΑΙΔΕΥΣΗ"
            imgurl="/assets/icons/leash.svg"
            className="justify-center "
          />
        ),
        cell: ({ row }) => (
          <div className="justify-center">{row.getValue("name")}</div>
        ),
      },
      {
        id: "client",
        accessorFn: (row) => {
          return `${row.clientId.lastName} ${row.clientId.firstName}`;
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="ΠΕΛΑΤΗΣ"
            imgurl="/assets/icons/client.svg"
            className="justify-center"
          />
        ),
        cell: ({ row }) => (
          <div className="justify-center">{row.getValue("client")}</div>
        ),
      },
      {
        id: "date",
        accessorFn: (row) => {
          return formatDate(new Date(row.date), "el");
        },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="ΗΜΕΡΟΜΗΝΙΑ"
            imgurl="/assets/icons/calendar.svg"
          />
        ),
        cell: ({ row }) => (
          <div className="ml-8 text-start">{row.getValue("date")}</div>
        ),
      },
      {
        id: "timeArrival",
        accessorKey: "timeArrival",
        header: () => (
          <span className="flex flex-row items-center gap-2">
            <Image
              src={"/assets/icons/arrival.svg"}
              alt="αφιξη"
              width="20"
              height={20}
            />
            ΑΡΧΗ
          </span>
        ),
        cell: ({ row }) => row.getValue("timeArrival"),
      },
      {
        id: "timeDeparture",
        accessorKey: "timeDeparture",
        header: () => (
          <span className="flex flex-row items-center gap-2">
            <Image
              src={"/assets/icons/departure.svg"}
              alt="αφιξη"
              width={25}
              height={20}
            />
            ΤΕΛΟΣ
          </span>
        ),
        cell: ({ row }) => row.getValue("timeDeparture"),
      },
      {
        id: "Dogs",
        accessorFn: (row) => {
          if (row.dogs) {
            const totals = row.dogs.map((dog: any) => dog.dogName);
            return totals;
          } else {
            return "No dogs found";
          }
        },
        header: () => (
          <span className="flex flex-row items-center gap-2">
            <Image
              src={"/assets/icons/dog.svg"}
              alt="dogs"
              width={25}
              height={20}
            />
            ΣΚΥΛΟΙ
          </span>
        ),
        cell: ({ row }) => {
          const totals: Array<string> = row.getValue("Dogs");
          return (
            <div className="flex flex-col justify-center gap-2">
              {totals.map((dog, index) => (
                <span key={index} className="self-center">
                  {dog}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        id: "price",
        accessorFn: (row) => {
          return row.price + "€";
        },
        header: () => (
          <span className="flex flex-row items-center gap-2">
            <Image
              src={"/assets/icons/euro.svg"}
              alt="dogs"
              width={25}
              height={20}
            />
            ΣΥΝΟΛΟ
          </span>
        ),
      },
      {
        id: "notes",
        accessorFn: (row) => row.notes,
        header: () => (
          <span className="flex flex-row items-center gap-2">
            <Image
              src={"/assets/icons/notes.svg"}
              alt="dogs"
              width={25}
              height={20}
            />
            ΣΗΜΕΙΩΣΕΙΣ
          </span>
        ),
        cell: ({ row }) => {
          return (
            <HoverCard>
              <HoverCardTrigger>
                <Image
                  src={"/assets/icons/card.svg"}
                  alt="hover"
                  width={50}
                  height={50}
                  className="mx-auto rounded-lg border-2 border-pink-800 p-2 hover:scale-110"
                />
              </HoverCardTrigger>
              <HoverCardContent
                align="center"
                className="background-light800_dark400 font-sans font-bold "
              >
                {row.getValue("notes")}
              </HoverCardContent>
            </HoverCard>
          );
        },
      },
    ],
  },
];
