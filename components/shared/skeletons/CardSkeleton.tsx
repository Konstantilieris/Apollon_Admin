"use client";
import React from "react";
import styles from "./CardSkeleton.module.css";
import { useTheme } from "@/context/ThemeProvider";
const CardSkeleton = () => {
  const theme = useTheme();

  return (
    <div
      className={`h-32 w-full max-w-[230px] self-center ${styles.skeleton} ${
        theme.mode === "dark" ? styles.skeletonDark : ""
      }`}
    ></div>
  );
};

export default CardSkeleton;