"use client";

import React, { useState, useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarBody,
  SidebarButton,
  SidebarLink,
} from "@/components/ui/Sidebar";
import Toggle from "./Toggle";
import {
  IconBrandTabler,
  IconChartBar,
  IconUserBolt,
  IconListDetails,
  IconCalendarCode,
  IconHomeCog,
  IconExposure,
  IconArrowLeft,
  IconCashRegister,
  IconCashBanknote,
} from "@tabler/icons-react";

// 1) Define static data & variants outside the component
const NAV_LINKS = [
  { label: "Επισκόπηση", href: "/main", Icon: IconBrandTabler },
  { label: "Εγγραφή", href: "/form", Icon: IconListDetails },
  { label: "Πελάτες", href: "/clients", Icon: IconUserBolt },
  { label: "Ημερολόγιο", href: "/calendar", Icon: IconCalendarCode },
  { label: "Κρατήσεις", href: "/booking", Icon: IconHomeCog },
  { label: "Ανάλυση", href: "/logistics", Icon: IconChartBar },
  { label: "Έξοδα", href: "/expenses", Icon: IconExposure },
  { label: "Έσοδα", href: "/payments", Icon: IconCashRegister },
  { label: "Οφειλές", href: "/services", Icon: IconCashBanknote },
];

const animateVariants = {
  initialState: { opacity: 0 },
  animateState: { opacity: 1 },
  exitState: { opacity: 0 },
};

function getIconClass(isActive: boolean) {
  const baseClasses = "h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200";
  const activeClasses = "text-primary-500 dark:text-yellow-500 w-7";
  return cn(baseClasses, { [activeClasses]: isActive });
}

// 2) Define the component as a regular function
export function AnimatedSidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const path = usePathname(); // Get the current path
  // Memoize a "base path" to use as the key for AnimatePresence

  // Memoize the navigation links so they don't re-render unnecessarily.
  const navLinks = useMemo(() => {
    return NAV_LINKS.map(({ label, href, Icon }, idx) => {
      const isActive = path === href;
      return (
        <SidebarLink
          key={idx}
          link={{
            label,
            href,
            icon: <Icon className={getIconClass(isActive)} />,
          }}
        />
      );
    });
  }, [path]);

  // Memoize the sign-out function.
  const handleSignOut = useCallback(async () => {
    sessionStorage.clear();
    await signOut({ redirect: false });
    router.replace("./");
    router.refresh();
  }, [router]);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row ",
        "bg-neutral-200 dark:bg-neutral-800 w-full flex-1 mx-auto",
        "border border-neutral-500 dark:border-neutral-700 overflow-hidden z-50",
        "h-screen"
      )}
    >
      {/* Sidebar Navigation (static, outside of animated container) */}
      <Sidebar open={open} setOpen={setOpen} animate>
        <SidebarBody className="w-full">
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="mt-2 flex flex-row items-center gap-2 text-xl text-dark-100 dark:text-light-900">
              <Image
                src="/assets/icons/bone.svg"
                className="ml-1 h-8 w-6 shrink-0 rounded-full dark:invert"
                width={16}
                height={16}
                alt="Avatar"
              />
              Apollon
            </div>
            <div className="ml-1 mt-8 flex flex-col items-start gap-2">
              {navLinks}
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-4">
            <Toggle />
            <SidebarButton
              handleClick={handleSignOut}
              label="Αποσύνδεση"
              icon={
                <IconArrowLeft className="h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
              }
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Animated content area */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={path}
          className={cn(
            "flex-1 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700",
            "bg-white dark:bg-neutral-900 flex flex-col gap-2 h-full ml-12 w-full"
          )}
          initial="initialState"
          animate="animateState"
          exit="exitState"
          transition={{ duration: 0.15, ease: "easeInOut" }} // faster fade
          variants={animateVariants}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
