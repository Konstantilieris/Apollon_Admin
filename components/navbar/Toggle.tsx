"use client";

import * as React from "react";

import { useTheme } from "next-themes";
import { IconSun, IconMoon } from "@tabler/icons-react";
export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="mr-2 flex items-center">
      {theme === "dark" ? (
        <IconSun
          className="h-5 w-5 text-neutral-700 dark:text-neutral-200"
          onClick={() => setTheme("light")}
        />
      ) : (
        <IconMoon
          className="h-5 w-5 text-neutral-700 dark:text-neutral-200"
          onClick={() => setTheme("dark")}
        />
      )}
    </div>
  );
}
