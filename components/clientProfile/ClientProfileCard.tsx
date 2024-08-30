"use client";
import { cn, formatDateString } from "@/lib/utils";

import {
  IconChartBar,
  IconEditCircle,
  IconExchange,
  IconMapCog,
  IconUserCircle,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function ClientProfileCard({ client }: any) {
  const path = usePathname();
  const iconReturn = () => {
    switch (path) {
      case `/clients/${client._id}`:
        return <IconUserCircle className="h-10 w-10  object-cover" />;
      case `/clients/${client._id}/edit`:
        return (
          <IconEditCircle className="h-10 w-10 rounded-full border-2 object-cover" />
        );
      case `/clients/${client._id}/services`:
        return (
          <IconExchange className="h-10 w-10 rounded-full border-2 object-cover" />
        );
      case `/clients/${client._id}/chart`:
        return (
          <IconChartBar className="h-10 w-10 rounded-full border-2 object-cover" />
        );
    }
  };
  return (
    <div className="group/card w-full max-w-xs self-start  ">
      <div
        className={cn(
          "overflow-hidden relative card h-34 rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4"
        )}
      >
        <div className="absolute left-0 top-0 h-full w-full bg-neutral-700 opacity-60 transition duration-300 group-hover/card:bg-black"></div>
        <div className="z-10 flex flex-row items-center space-x-4">
          {iconReturn()}
          <div className="flex flex-col">
            <p className="relative z-10 text-base font-normal text-gray-50">
              {client?.name}
            </p>
            <p className="text-sm text-gray-400">
              {formatDateString(client.createdAt)}
            </p>
          </div>
        </div>
        <Link href={`/booking/${client._id}`} prefetch={true}>
          <IconMapCog className="absolute right-4 top-4 z-10 text-green-300 hover:scale-110" />
        </Link>
      </div>
    </div>
  );
}
