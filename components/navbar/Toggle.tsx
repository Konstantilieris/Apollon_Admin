// @ts-nocheck
"use client";
import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { SidebarButton } from "../ui/Sidebar";
import { IconMoon, IconSun } from "@tabler/icons-react";
const Toggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  const toggleDarkMode = async () => {
    if (ref.current === null) return;
    await document.startViewTransition(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    }).ready;
    const { top, left, width } = ref.current.getBoundingClientRect();
    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom));
    document.documentElement.animate(
      {
        clipPath: [
          `
          circle(0% at ${left + width / 2}px ${top}px)
          `,
          `
          circle(${maxRadius}px at ${left}px ${top}px)`,
        ],
      },
      {
        duration: 1000,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };
  return (
    <SidebarButton
      className=" "
      handleClick={toggleDarkMode}
      label={theme === "dark" ? "Φωτεινό" : "Σκοτεινό"}
      thisref={ref}
      icon={
        theme === "dark" ? (
          <IconSun className="h-7 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
        ) : (
          <IconMoon className="h-5 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
        )
      }
    />
  );
};

export default Toggle;
