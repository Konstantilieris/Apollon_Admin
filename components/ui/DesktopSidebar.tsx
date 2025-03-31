import React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./Sidebar";
import { motion } from "framer-motion";

const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden  md:flex md:flex-col bg-neutral-200 dark:bg-neutral-800 flex-shrink-0",
          className
        )}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        animate={{
          width: animate ? (open ? "180px" : "65px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};
export default DesktopSidebar;
