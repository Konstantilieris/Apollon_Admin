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
            className="text-center"
            imgurl="/assets/icons/room.svg"
          />
        ),
        cell: ({ row }) => {
          return (
            <Link href={``}>
              <div className="text-center font-sans text-lg font-bold">
                {row.getValue("name")}
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
              <div className="flex items-center justify-center gap-2 text-start font-sans font-bold">
                <Badge className="h-6 w-6 rounded-full bg-celtic-green" />
                ΔΙΑθΕΣΙΜΟ
              </div>
            );
          } else {
            return (
              <div className=" flex flex-row items-center justify-center  gap-4 font-sans text-sm font-bold">
                <Badge className="h-6 w-6 rounded-full bg-red-dark" />
                <div className="flex flex-col gap-2 ">
                  {see.map((name, index) => (
                    <h1 key={index} className="flex flex-col">
                      {" "}
                      {name}
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
              <div className="ml-2 flex  justify-center gap-2 text-start font-sans font-bold">
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
            <div className=" ml-2 flex flex-col justify-center gap-2 font-sans text-lg font-bold ">
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
            title="Άφιξη"
            className="text-start"
          />
        ),
        accessorFn: (row) => {
          if (row.currentBookings) {
            const dates = row.currentBookings.map((booking: any) => {
              return {
                fromDate: booking.fromDate,
                timeArrival: booking.timeArrival,
                flag: booking.flag,
              };
            });
            return dates;
          } else {
            return null;
          }
        },
        cell: ({ row }) => {
          const see: Array<any> = row.getValue("ReservationsStart");
          if (see.length === 0) {
            return (
              <div className="ml-8 flex justify-center gap-2 text-center font-sans font-bold">
                -
              </div>
            );
          }
          return (
            <div className=" ml-8 flex flex-col gap-2 text-start font-sans text-lg font-bold ">
              {see.map((item, index) => (
                <h1 key={index} className="flex">
                  {formatDate(new Date(item.fromDate), "el")} {item.timeArrival}
                  {item.flag ? (
                    <Image
                      alt="car"
                      width={25}
                      height={15}
                      src="/assets/icons/car.svg"
                    />
                  ) : null}
                </h1>
              ))}
            </div>
          );
        },
      },
      {
        id: "ReservationEnd",
        header: ({ column }) => (
          <DataTableColumnHeader
            imgurl="/assets/icons/departure.svg"
            column={column}
            title="Αναχώρηση"
            className="text-start"
          />
        ),
        accessorFn: (row) => {
          if (row.currentBookings) {
            const dates = row.currentBookings.map((booking: any) => {
              return {
                toDate: booking.toDate,
                timeDeparture: booking.timeDeparture,
                flag: booking.flag,
              };
            });
            return dates;
          } else {
            return null;
          }
        },
        cell: ({ row }) => {
          const see: Array<any> = row.getValue("ReservationEnd");
          if (see.length === 0) {
            return (
              <div className="ml-8 flex justify-center gap-2 text-center font-sans font-bold">
                -
              </div>
            );
          }
          return (
            <div className=" ml-8 flex flex-col gap-2 text-start font-sans text-lg font-bold ">
              {see.map((item, index) => (
                <h1 key={index} className="flex">
                  {" "}
                  {formatDate(new Date(item.toDate), "el")} {item.timeDeparture}
                  {item.flag ? (
                    <Image
                      alt="car"
                      width={25}
                      height={15}
                      src="/assets/icons/car.svg"
                    />
                  ) : null}
                </h1>
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
              <div className=" flex items-center justify-center gap-2 font-sans font-bold">
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
            <div className="flex flex-col justify-center gap-2 font-sans text-lg font-bold">
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
