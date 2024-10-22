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
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Toggle from "./Toggle";

export function AnimatedSidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();

  const links = [
    {
      label: "Επισκόπηση",
      href: "/main",
      icon: (
        <IconBrandTabler
          className={cn(
            "h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200",
            { "text-primary-500 dark:text-yellow-500 w-7": path === "/main" }
          )}
        />
      ),
    },

    {
      label: "Εγγραφή",
      href: "/form",
      icon: (
        <IconListDetails
          className={cn(
            "h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200",
            { "text-primary-500 dark:text-yellow-500 w-7": path === "/form" }
          )}
        />
      ),
    },
    {
      label: "Πελάτες",
      href: "/clients",
      icon: (
        <IconUserBolt
          className={cn(
            "h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200",
            { "text-primary-500 dark:text-yellow-500 w-7": path === "/clients" }
          )}
        />
      ),
    },
    {
      label: "Ημερολόγιο",
      href: "/calendar",
      icon: (
        <IconCalendarCode
          className={cn(
            "h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200",
            {
              "text-primary-500 dark:text-yellow-500 w-7": path === "/calendar",
            }
          )}
        />
      ),
    },
    {
      label: "Κρατήσεις",
      href: "/booking",
      icon: (
        <IconHomeCog
          className={cn(
            "h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200",
            { "text-primary-500 dark:text-yellow-500 w-7": path === "/booking" }
          )}
        />
      ),
    },
    {
      label: "Ανάλυση",
      href: "/logistics",
      icon: (
        <IconChartBar
          className={cn(
            "h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200",
            {
              "text-primary-500 dark:text-yellow-500 w-7":
                path === "/logistics",
            }
          )}
        />
      ),
    },

    {
      label: "Έξοδα",
      href: "/expenses",
      icon: (
        <IconExposure
          className={cn(
            "h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200",
            {
              "text-primary-500 dark:text-yellow-500 w-7": path === "/expenses",
            }
          )}
        />
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
            <div className="mt-2 flex flex-row items-center gap-2  text-xl text-dark-100 dark:text-light-900">
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
      <AnimatePresence mode="wait" key={path}>
        <motion.div
          className={cn(
            "flex-1 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 h-full ml-12 w-full "
          )}
          initial="initialState"
          animate="animateState"
          exit="exitState"
          transition={{ duration: 0.3, ease: "easeIn" }}
          variants={{
            initialState: {
              opacity: 0,
              clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
            },
            animateState: {
              opacity: 1,
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
            },
            exitState: {
              opacity: 0,
              clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
            },
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
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
