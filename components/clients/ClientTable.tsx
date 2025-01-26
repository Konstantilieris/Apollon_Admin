import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateString } from "@/lib/utils";
import Link from "next/link";

const ClientTable = ({ clients }: { clients: any }) => {
  return (
    <Table className=" w-full">
      <TableHeader className="h-20 border-b  border-light-700 bg-white   py-4 font-normal text-black dark:border-yellow-500 dark:bg-neutral-950 dark:text-light-700 xl:text-lg">
        <TableRow className={" border-none tracking-wider"}>
          <TableHead className="ml-2 text-start max-lg:hidden">
            Ημερομηνία
          </TableHead>
          <TableHead className="text-center xl:pr-48">Ονοματεπώνυμο</TableHead>
          <TableHead className="px-2 text-center ">Σκύλος</TableHead>
          <TableHead className="px-2 text-center max-lg:hidden">
            Επάγγελμα
          </TableHead>
          <TableHead className="text-center max-md:hidden">Τηλέφωνο</TableHead>

          <TableHead className="px-2 text-center max-lg:hidden">
            Περιοχή
          </TableHead>
          <TableHead className="px-2 text-center max-lg:hidden">
            Διεύθυνση
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="mt-2 ">
        {clients?.map((client: any) => (
          <TableRow
            key={client?._id?.toString()}
            className="text-dark100_light900 dark:bg-neutral-950 "
          >
            <TableCell className="max-w-[250px] pl-4 pr-10 text-base font-normal max-lg:hidden">
              {client.createdAt ? formatDateString(client.createdAt) : "N/A"}
            </TableCell>
            <TableCell className="ml-4 flex h-full max-w-[500px] items-center justify-center truncate py-8 pr-10 text-center text-base font-normal 2xl:max-w-[600px]">
              <Link
                href={`/clients/${client?._id}`}
                className=" cursor-pointer hover:scale-105"
              >
                {client?.name}
              </Link>
            </TableCell>
            <TableCell className="text-center text-base font-normal ">
              <div className="flex flex-col items-center ">
                {client?.dog?.map((dog: any) => (
                  <span key={dog._id}>{dog.name}</span>
                )) || "N/A"}
              </div>
            </TableCell>
            <TableCell className="text-center text-base font-normal max-lg:hidden">
              {client?.profession || "N/A"}
            </TableCell>
            <TableCell className="mr-4 text-center text-base font-normal max-md:hidden">
              {client?.phone?.mobile || "N/A"}
            </TableCell>

            <TableCell className="text-center text-base font-normal max-lg:hidden">
              {client?.location?.city ? `${client.location.city} ` : "N/A"}
            </TableCell>
            <TableCell className="text-center text-base font-normal max-lg:hidden">
              {client?.location?.address || "N/A"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientTable;
