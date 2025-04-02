"use client";

import React from "react";
import ReactDOM from "react-dom";
import { FloatingSearch } from "./GlobalSearchReveal";
// your existing FloatingSearch component

export const FloatingSearchPortal = () => {
  // Ensure this runs only in the browser
  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <FloatingSearch />,
    document.body // Alternatively, use document.getElementById('portal') if you have a dedicated container.
  );
};
