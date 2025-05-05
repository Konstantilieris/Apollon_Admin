"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import qs from "query-string";

export type SortDir = "ascending" | "descending";

export const useUrlSortDescriptor = (
  defaultColumn = "date",
  defaultDirection: SortDir = "descending"
) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // initialise from URL
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: SortDir;
  }>({
    column: searchParams.get("sort") ?? defaultColumn,
    direction:
      searchParams.get("direction") === "asc" ? "ascending" : defaultDirection,
  });

  // push to URL whenever it changes
  useEffect(() => {
    const current = qs.parse(searchParams.toString());

    // remove page whenever we change sort
    delete current.page;

    const nextQuery = qs.stringify({
      ...current,
      sort: sortDescriptor.column,
      direction: sortDescriptor.direction === "ascending" ? "asc" : "desc",
    });

    router.push(`${pathname}?${nextQuery}`, { scroll: false });
  }, [sortDescriptor]);

  return { sortDescriptor, setSortDescriptor } as const;
};
