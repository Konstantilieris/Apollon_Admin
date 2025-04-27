// hooks/useUrlSortDirection.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

export const useUrlSortDirection = (
  defaultDirection: "asc" | "desc" = "desc"
) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL
  const initialSort = (() => {
    const raw = searchParams.get("sortDir");
    if (raw === "asc" || raw === "desc") return raw;
    return defaultDirection;
  })();

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    initialSort
  );

  useEffect(() => {
    let newUrl;

    // Always remove 'page' when sort changes
    newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ["page"],
    });

    // Manage sortDir param
    if (sortDirection === defaultDirection) {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["sortDir"],
      });
    } else {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "sortDir",
        value: sortDirection,
      });
    }

    router.push(newUrl, { scroll: false });
  }, [sortDirection, defaultDirection]);

  return { sortDirection, setSortDirection };
};
