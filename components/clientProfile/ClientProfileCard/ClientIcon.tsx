"use client";
import {
  IconEditCircle,
  IconBrandBooking,
  IconExchange,
  IconChartBar,
  IconUser,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import React from "react";

const ClientIcon = ({ id }: { id: string }) => {
  const path = usePathname();
  switch (path) {
    case `/clients/${id}`:
      return <IconUser className="h-10 w-12  object-cover" />;
    case `/clients/${id}/edit`:
      return <IconEditCircle className="h-10 w-12    object-cover" />;
    case `/clients/${id}/book`:
      return <IconBrandBooking className="h-12 w-12   object-cover" />;
    case `/clients/${id}/services`:
      return (
        <IconExchange className="h-10 w-12 rounded-full border-2 object-cover" />
      );
    case `/clients/${id}/chart`:
      return (
        <IconChartBar className="h-10 w-12 rounded-full border-2 object-cover" />
      );
  }
};

export default ClientIcon;
