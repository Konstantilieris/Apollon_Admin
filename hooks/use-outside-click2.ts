"use client";
import React, { useEffect } from "react";
export function useOutsideClick2(
  refs: React.RefObject<HTMLElement>[],
  callback: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        refs.some(
          (ref) => ref.current && ref.current.contains(event.target as Node)
        )
      ) {
        return;
      }
      // Click was outside the provided refs, so we trigger the callback
      callback();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
}
