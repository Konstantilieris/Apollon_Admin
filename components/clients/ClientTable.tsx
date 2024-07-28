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
    <Table className="text-dark400_light700 mt-12 w-full font-sans">
      <TableHeader className="border-b-8 border-light-700 bg-white text-base font-semibold text-black dark:border-dark-400 dark:bg-slate-700 dark:text-light-700 xl:text-lg">
        <TableRow>
          <TableHead className="ml-2 text-start max-lg:hidden">
            Ημερομηνία
          </TableHead>
          <TableHead className="text-center">Ονοματεπώνυμο</TableHead>
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
      <TableBody className="mt-2">
        {clients?.map((client: any) => (
          <TableRow
            key={client?._id?.toString()}
            className="background-light800_dark300 text-dark100_light900 font-sans"
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
            <TableCell className="text-center text-base font-normal  ">
              {client?.dog?.map((dog: any) => dog.name) || "N/A"}
            </TableCell>
            <TableCell className="text-center text-base font-normal max-lg:hidden">
              {client?.profession || "N/A"}
            </TableCell>
            <TableCell className="mr-4 text-center text-base font-normal max-md:hidden">
              {client?.phone?.mobile || "N/A"}
            </TableCell>

            <TableCell className="text-center text-base font-normal max-lg:hidden">
              {client?.location?.city
                ? `${client.location.city} (${client.vet.phone})`
                : "N/A"}
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
