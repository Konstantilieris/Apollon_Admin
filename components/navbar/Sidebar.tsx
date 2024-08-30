"use client";
import React, { useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarButton,
  SidebarLink,
} from "@/components/ui/Sidebar";
import {
  IconBrandTabler,
  IconChartBar,
  IconUserBolt,
  IconListDetails,
  IconCalendarCode,
  IconHomeCog,
  IconExposure,
  IconArrowLeft,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Toggle from "./Toggle";

export function AnimatedSidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const links = [
    {
      label: "Επισκόπηση",
      href: "/main",
      icon: (
        <IconBrandTabler className="h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },

    {
      label: "Εγγραφή",
      href: "/form",
      icon: (
        <IconListDetails className="h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Πελάτες",
      href: "/clients",
      icon: (
        <IconUserBolt className="h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Ημερολόγιο",
      href: "/calendar",
      icon: (
        <IconCalendarCode className="h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Κρατήσεις",
      href: "/booking",
      icon: (
        <IconHomeCog className="h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Ανάλυση",
      href: "/logistics",
      icon: (
        <IconChartBar className="h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },

    {
      label: "Έξοδα",
      href: "/expenses",
      icon: (
        <IconExposure className="h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-neutral-200 dark:bg-neutral-800 w-full flex-1  mx-auto border border-neutral-500 dark:border-neutral-700 overflow-hidden z-50 ",
        "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="w-full">
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="mt-2 flex flex-row items-center gap-2 font-sans text-xl text-dark-100 dark:text-light-900">
              <Image
                src="/assets/icons/bone.svg"
                className="ml-1 h-8 w-6 shrink-0 rounded-full dark:invert"
                width={16}
                height={16}
                alt="Avatar"
              />
              Apollon
            </div>
            <div className="ml-1 mt-8 flex  flex-col items-start gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col items-start  gap-4">
            <Toggle />
            <SidebarButton
              handleClick={() => {
                sessionStorage.clear();
                signOut({ redirect: false }).then(() => {
                  router.replace("./");
                  router.refresh();
                  // Redirect to the home page after signing out
                });
              }}
              label={"Αποσύνδεση"}
              icon={
                <IconArrowLeft className="h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
              }
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div
        className={cn(
          "flex-1 rounded-tl-2xl border transition-colors duration-500 ease-in-out border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 h-full ml-12 w-full"
        )}
      >
        {children}
      </div>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre font-medium text-black dark:text-white"
      >
        Apollon Admin
      </motion.span>
    </Link>
  );
};
