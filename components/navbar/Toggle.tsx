"use client";
import React, { useEffect } from "react";
import { useTheme } from "next-themes";
import { SidebarButton } from "../ui/Sidebar";
import { IconMoon, IconSun } from "@tabler/icons-react";
const Toggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <SidebarButton
      className="items-end gap-4"
      handleClick={
        theme === "dark" ? () => setTheme("light") : () => setTheme("dark")
      }
      label={theme === "dark" ? "Φωτεινό" : "Σκοτεινό"}
      icon={
        theme === "dark" ? (
          <IconSun className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
        ) : (
          <IconMoon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
        )
      }
    />
  );
};

export default Toggle;
