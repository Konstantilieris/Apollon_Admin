"use client";

import { ColumnDef } from "@tanstack/react-table";

import { formatDateString } from "@/lib/utils";
import { IClient } from "@/database/models/client.model";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { TypesOfBehavior } from "@/constants";
import Link from "next/link";
export const columns: ColumnDef<IClient>[] = [
  {
    id: "actions",
    enableHiding: false,

    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
  {
    id: "Client",
    enableHiding: true,
    enableGlobalFilter: true,
    columns: [
      {
        id: "grouped&sorted",
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Όνομα" />
        ),
        cell: ({ row }) => {
          console.log(row);
          return (
            <Link href={`/clients/${row.original?._id}`}>
              <div>{row.getValue("grouped&sorted")}</div>{" "}
            </Link>
          );
        },
      },

      {
        accessorKey: "email",
        header: () => <div>Email</div>,
      },
      {
        accessorKey: "profession",
        header: "Επάγγελμα",
      },
      {
        accessorKey: "birthdate",
        header: () => <div className="text-right">Ημ.Γέννησης</div>,
        cell: ({ row }) => {
          const parsedDate = formatDateString(row.getValue("birthdate"));
          return <div className="text-center font-medium">{parsedDate}</div>;
        },
      },
      {
        accessorKey: "location.residence",
        header: "Είδος Κατοικίας",
      },
      {
        accessorKey: "location.address",
        header: "Διεύθυνση",
      },
      {
        accessorKey: "location.city",
        header: "Πόλη",
      },
      {
        accessorKey: "phone.telephone",
        header: "Σταθερό",
      },
      {
        accessorKey: "phone.mobile",
        header: "Κινητό",
      },

      {
        accessorKey: "owes",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Οφειλές" />
        ),
        cell: ({ row }) => {
          return <div className="text-center">{row.getValue("owes")} </div>;
        },
      },
      {
        accessorKey: "totalSpent",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Σύνολο Δαπανών" />
        ),
        cell: ({ row }) => {
          return (
            <div className="text-center">{row.getValue("totalSpent")} </div>
          );
        },
      },
    ],
  },

  {
    id: "Dog",
    enableHiding: true,
    enableGlobalFilter: true,
    columns: [
      {
        accessorKey: "dog.name",
        header: "Όνομα Σκύλου",
      },
      {
        accessorKey: "dog.gender",
        header: "Φύλο",
        cell: ({ row }) => {
          return (
            <div className="text-center">{row.getValue("dog_gender")}</div>
          );
        },
      },
      {
        accessorKey: "Γενέθλια Σκύλου",
        accessorFn: (row) => row.dog?.birthdate,
        cell: ({ row }) => {
          const parsedDate = formatDateString(row.getValue("birthdate"));
          return <div className="text-center font-medium">{parsedDate}</div>;
        },
      },
      {
        accessorKey: "dog.food",
        header: "Είδος Τροφής",
      },
      {
        accessorKey: "dog.breed",
        header: "Ράτσα",
      },
      {
        accessorKey: "dog.behavior",
        header: "Συμπεριφορά",
        cell: ({ row }) => {
          const behavior = TypesOfBehavior.find(
            (behavior) => behavior === row.getValue("dog_behavior")
          );

          if (!behavior) {
            return null;
          }

          return (
            <div className="flex w-[100px] items-center">
              <span>{behavior}</span>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "dog.vet",
        header: "Κτηνίατρος",
      },
      {
        accessorKey: "dog.vetNumber",
        header: "Τηλ Κτηνίατρου",
      },
    ],
  },
];
