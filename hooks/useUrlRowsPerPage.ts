"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

/**
 * Keeps ?limit=<number> in sync with React state.
 */
export const useUrlRowsPerPage = (defaultRows = 10) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [rowsPerPage, setRowsPerPage] = useState<number>(
    Number(searchParams.get("limit") ?? defaultRows)
  );

  /* update URL when the value changes */
  useEffect(() => {
    let nextUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ["page"],
    });

    nextUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "limit",
      value: String(rowsPerPage),
    });

    router.push(nextUrl, { scroll: false });
  }, [rowsPerPage]);

  /* handy onChange handler for <select> */
  const onRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setRowsPerPage(Number(e.target.value));

  return { rowsPerPage, onRowsPerPageChange } as const;
};
