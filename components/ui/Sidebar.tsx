"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { motion } from "framer-motion";
import {} from "@tabler/icons-react";
import { Button } from "./button";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-isMobile";
import dynamic from "next/dynamic";
import DesktopSidebar from "./DesktopSidebar";
const MobileSidebar = dynamic(() => import("./MobileSidebar"));

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileSidebar {...(props as React.ComponentProps<"div">)} />
  ) : (
    <DesktopSidebar {...props} />
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  const path = usePathname();
  return (
    <Link
      href={link.href}
      className={cn(
        "items-center flex justify-center gap-2  group/sidebar py-2",
        className
      )}
      {...props}
    >
      {link.icon}

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className={cn(
          "!m-0 inline-block whitespace-pre !p-0  text-lg text-neutral-700 transition duration-150 group-hover/sidebar:translate-x-1 dark:text-neutral-200",
          { "text-primary-500 dark:text-yellow-500": path === link.href }
        )}
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
export const SidebarButton = ({
  icon,
  handleClick,
  className,
  label,
  thisref,
  ...props
}: any) => {
  const { open, animate } = useSidebar();
  return (
    <Button
      onClick={handleClick}
      className={cn(" gap-2   ", className)}
      ref={thisref}
      {...props}
    >
      {icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        whileHover={{
          translateX: 7,
          transition: { duration: 0.2 },
        }}
        className="inline-block whitespace-pre  text-lg  text-neutral-700 dark:text-neutral-200"
      >
        {label}
      </motion.span>
    </Button>
  );
};
