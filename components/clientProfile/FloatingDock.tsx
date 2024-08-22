import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconChartBar,
  IconEditCircle,
  IconExchange,
  IconUserCircle,
} from "@tabler/icons-react";

export function FloatingDockClient({ id }: { id: string }) {
  const links = [
    {
      title: "ΠΡΟΦΙΛ",
      icon: (
        <IconUserCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/clients/" + id,
    },

    {
      title: "ΕΠΕΞΕΡΓΑΣΙΑ",
      icon: (
        <IconEditCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
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
