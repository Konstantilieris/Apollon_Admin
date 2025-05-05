"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

/** keeps ?date=last7Days|last30Days|last60Days in the URL */
export const useUrlDateFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dateFilter, setDateFilter] = useState(
    searchParams.get("date") ?? "all"
  );

  useEffect(() => {
    let nextUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ["page"],
    });

    if (dateFilter === "all") {
      nextUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["date"],
      });
    } else {
      nextUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "date",
        value: dateFilter,
      });
    }
    router.push(nextUrl, { scroll: false });
  }, [dateFilter]);

  return { dateFilter, setDateFilter };
};
