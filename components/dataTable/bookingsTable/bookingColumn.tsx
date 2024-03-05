"use client";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import Link from "next/link";

import { DataTableColumnHeader } from "../clientsTable/data-table-column-header";

import { Badge } from "@/components/ui/badge";

import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { DataTableBookingRowActions } from "./data-table-booking-actions";

export const roomColumns = (): ColumnDef<any>[] => [
  {
    id: "Room",
    header: ({ column }) => <div className="">ΣΥΣΤΗΜΑ ΚΡΑΤΗΣΕΩΝ</div>,
    enableSorting: true,
    enableGlobalFilter: true,
    columns: [
      {
        id: "actions",
        enableHiding: false,

        cell: ({ row }) => <DataTableBookingRowActions row={row} />,
      },
      {
        id: "name",
        accessorKey: "name",
        enableSorting: true,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Όνομα "
            className="text-start"
          />
        ),
        cell: ({ row }) => {
          return (
            <Link href={``}>
              <div className="ml-12 text-start font-noto_sans text-lg font-bold">
                Δωμάτιο {row.getValue("name")}
              </div>{" "}
            </Link>
          );
        },
      },
    ],
  },
  {
    id: "Κρατήσεις",

    enableSorting: true,
    enableGlobalFilter: true,
    columns: [
      {
        id: "Status",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataTableColumnHeader
              imgurl="/assets/icons/dog.svg"
              column={column}
              title="Διαμένοντες"
              className="text-start"
            />
          </div>
        ),
        accessorFn: (row) => {
          if (row.currentBookings) {
            const names = row.currentBookings.map((booking: any) => {
              return booking.dogs.map((dog: any) => {
                if (dog.roomId === row._id) {
                  return dog.dogName;
                } else return null;
              });
            });
            return names;
          } else {
            return null;
          }
        },
        cell: ({ row }) => {
          const see: Array<String> = row.getValue("Status");

          if (see.length === 0) {
            return (
              <div className="flex items-center justify-center gap-2 text-start font-noto_sans font-bold">
                <Badge className="h-6 w-6 rounded-full bg-celtic-green" />
                ΔΙΑθΕΣΙΜΟ
              </div>
            );
          } else {
            return (
              <div className=" flex flex-row items-center justify-center  gap-4 font-noto_sans text-sm font-bold">
                <Badge className="h-6 w-6 rounded-full bg-red-dark" />
                <div className="flex flex-col gap-2 ">
                  {see.map((name, index) => (
                    <h1 key={index}>
                      {" "}
                      {name}
                      <br />
                    </h1>
                  ))}
                </div>
              </div>
            );
          }
        },
      },
      {
        id: "Clients",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Πελάτες"
            className="text-start"
            imgurl="/assets/icons/client.svg"
          />
        ),
        accessorFn: (row) => {
          if (row.currentBookings) {
            const names = row.currentBookings.map((booking: any) => {
              return booking.clientId.lastName;
            });
            return names;
          } else {
            return null;
          }
        },
        cell: ({ row }) => {
          const see: Array<String> = row.getValue("Clients");
          if (see.length === 0) {
            return (
              <div className="ml-2 flex  justify-center gap-2 text-start font-noto_sans font-bold">
                <Image
                  src="/assets/icons/noclient.svg"
                  alt="client"
                  width={30}
                  height={20}
                />
              </div>
            );
          }
          return (
            <div className=" ml-2 flex flex-col justify-center gap-2 font-noto_sans text-lg font-bold ">
              {see.map((name, index) => (
                <h1 key={index}> {name}</h1>
              ))}
            </div>
          );
        },
      },
      {
        id: "ReservationsStart",
        header: ({ column }) => (
          <DataTableColumnHeader
            imgurl="/assets/icons/departure.svg"
            column={column}
            title="Αρχή Κράτησης"
            className="text-start"
          />
        ),
        accessorFn: (row) => {
          if (row.currentBookings) {
            const dates = row.currentBookings.map((booking: any) => {
              return booking.fromDate;
            });
            return dates;
          } else {
            return null;
          }
        },
        cell: ({ row }) => {
          const see: Array<string> = row.getValue("ReservationsStart");
          if (see.length === 0) {
            return (
              <div className="ml-8 flex justify-center gap-2 text-center font-noto_sans font-bold">
                -
              </div>
            );
          }
          return (
            <div className=" ml-8 flex flex-col gap-2 text-start font-noto_sans text-lg font-bold ">
              {see.map((date, index) => (
                <h1 key={index}>{formatDate(new Date(date), "el")}</h1>
              ))}
            </div>
          );
        },
      },
      {
        id: "Reservations",
        header: ({ column }) => (
          <DataTableColumnHeader
            imgurl="/assets/icons/departure.svg"
            column={column}
            title="Τέλος Κράτησης"
            className="text-start"
          />
        ),
        accessorFn: (row) => {
          if (row.currentBookings) {
            const dates = row.currentBookings.map((booking: any) => {
              return booking.toDate;
            });
            return dates;
          } else {
            return null;
          }
        },
        cell: ({ row }) => {
          const see: Array<string> = row.getValue("Reservations");
          if (see.length === 0) {
            return (
              <div className="ml-8 flex justify-center gap-2 text-center font-noto_sans font-bold">
                -
              </div>
            );
          }
          return (
            <div className=" ml-8 flex flex-col gap-2 text-start font-noto_sans text-lg font-bold ">
              {see.map((date, index) => (
                <h1 key={index}>{formatDate(new Date(date), "el")}</h1>
              ))}
            </div>
          );
        },
      },
      {
        id: "Total",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Συνολική Τιμή"
            className="text-start"
            imgurl="/assets/icons/euro.svg"
          />
        ),
        accessorFn: (row) => {
          if (row.currentBookings) {
            const totals = row.currentBookings.map((total: any) => {
              return (
                total.totalAmount + "\u20ac Σύνολο Ημερών : " + total.totalDays
              );
            });
            return totals;
          } else {
            return null;
          }
        },
        cell: ({ row }) => {
          const see: Array<string> = row.getValue("Total");
          if (see.length === 0) {
            return (
              <div className=" flex items-center justify-center gap-2 font-noto_sans font-bold">
                <Image
                  src="/assets/icons/noDollar.svg"
                  alt="dollar"
                  width={30}
                  height={20}
                />
              </div>
            );
          }
          return (
            <div className="flex flex-col justify-center gap-2 font-noto_sans text-lg font-bold">
              {see.map((total, index) => (
                <h1 key={index}>{total}</h1>
              ))}
            </div>
          );
        },
      },
      {
        id: "Arrival",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Άφιξη Σκύλου"
            className="text-start"
            imgurl="/assets/icons/arrival.svg"
          />
        ),
        accessorFn: (row) => {
          if (row.currentBookings) {
            const arrivals = row.currentBookings.map((arrival: any) => {
              return arrival.timeArrival;
            });
            return arrivals;
          } else {
            return null;
          }
        },
        cell: ({ row }) => {
          const see: Array<string> = row.getValue("Arrival");
          if (see.length === 0) {
            return (
              <div className=" flex items-center justify-center gap-2 font-noto_sans font-bold">
                -
              </div>
            );
          }
          return (
            <div className="flex flex-col justify-center gap-2 font-noto_sans text-lg font-bold">
              {see.map((total, index) => (
                <h1 key={index}>{total}</h1>
              ))}
            </div>
          );
        },
      },
      {
        id: "Departure",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Αναχώρηση Σκύλου"
            className="text-start"
            imgurl="/assets/icons/departure.svg"
          />
        ),
        accessorFn: (row) => {
          if (row.currentBookings) {
            const departures = row.currentBookings.map((arrival: any) => {
              return arrival.timeDeparture;
            });
            return departures;
          } else {
            return null;
          }
        },
        cell: ({ row }) => {
          const see: Array<string> = row.getValue("Departure");
          if (see.length === 0) {
            return (
              <div className=" flex items-center justify-center gap-2 font-noto_sans font-bold">
                -
              </div>
            );
          }
          return (
            <div className="flex flex-col justify-center gap-2 font-noto_sans text-lg font-bold">
              {see.map((total, index) => (
                <h1 key={index}>{total}</h1>
              ))}
            </div>
          );
        },
      },
    ],
  },
];
