"use client";
import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconChartBar,
  IconEditCircle,
  IconExchange,
  IconUserCircle,
  IconBrandBooking,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function FloatingDockClient({ id }: { id: string }) {
  const path = usePathname();
  const links = [
    {
      title: "ΠΡΟΦΙΛ",
      icon: (
        <IconUserCircle
          className={cn(
            "h-full w-full text-neutral-500 dark:text-neutral-300",
            {
              "text-dark-100 dark:text-dark-100 ": path === `/clients/${id}`,
            }
          )}
        />
      ),
      href: "/clients/" + id,
    },

    {
      title: "ΚΡΑΤΗΣΗ",
      icon: (
        <IconBrandBooking
          className={cn(
            "h-full w-full text-neutral-500 dark:text-neutral-300",
            {
              "text-dark-100 dark:text-dark-100 ":
                path === `/clients/${id}/book`,
            }
          )}
        />
      ),
      href: `/clients/${id}/book`,
    },
    {
      title: "ΕΠΕΞΕΡΓΑΣΙΑ",
      icon: (
        <IconEditCircle
          className={cn(
            "h-full w-full text-neutral-500 dark:text-neutral-300",
            {
              "text-dark-100 dark:text-dark-100 ":
                path === `/clients/${id}/edit`,
            }
          )}
        />
      ),
      href: `/clients/${id}/edit`,
    },
    {
      title: "ΥΠΗΡΕΣΙΕΣ",
      icon: (
        <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "ΑΝΑΛΥΣΗ",
      icon: (
        <IconChartBar className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];
  return (
    <div className="fixed bottom-2  ">
      <FloatingDock mobileClassName="translate-y-20" items={links} />
    </div>
  );
}
